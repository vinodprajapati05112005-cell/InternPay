from __future__ import annotations

from decimal import Decimal

from django.db import transaction
from django.db.models import Count, Max, Q, Sum
from django.utils import timezone

from apps.common.choices import ContractStatus, MilestoneStatus
from apps.common.services import create_audit_log, create_notification
from apps.contracts.models import Contract


@transaction.atomic
def create_contract(*, company, validated_data: dict) -> Contract:
    milestones_data = validated_data.pop("milestones", [])
    student_id = validated_data.pop("student_id", None)
    judge_id = validated_data.pop("judge_id", None)

    student = None
    judge = None
    if student_id:
        from apps.students.models import Student

        student = Student.objects.filter(id=student_id).first()
    if judge_id:
        from apps.judges.models import Judge

        judge = Judge.objects.filter(id=judge_id).first()

    contract = Contract.objects.create(
        company=company,
        student=student,
        judge=judge,
        status=ContractStatus.ACTIVE if student else ContractStatus.DRAFT,
        funded_amount=validated_data["total_amount"],
        **validated_data,
    )
    if milestones_data:
        create_milestones(contract, milestones_data)

    create_audit_log(actor=company.user, action="contract_created", target=contract, summary=f"Created contract {contract.title}")
    if contract.student:
        create_notification(
            user=contract.student.user,
            title="New contract assigned",
            message=f"You have been assigned to contract: {contract.title}",
            notification_type="CONTRACT_UPDATE",
            channel="BOTH",
        )
    return contract


@transaction.atomic
def update_contract(contract: Contract, validated_data: dict) -> Contract:
    for field in [
        "title",
        "description",
        "requirements",
        "total_amount",
        "currency",
        "deadline",
        "notes",
    ]:
        if field in validated_data:
            setattr(contract, field, validated_data[field])
    if validated_data.get("student_id") is not None:
        from apps.students.models import Student

        contract.student = Student.objects.filter(id=validated_data["student_id"]).first()
    if validated_data.get("judge_id") is not None:
        from apps.judges.models import Judge

        contract.judge = Judge.objects.filter(id=validated_data["judge_id"]).first()
    contract.save()
    return contract


@transaction.atomic
def delete_contract(contract: Contract) -> None:
    contract.delete()


@transaction.atomic
def assign_student(contract: Contract, student) -> Contract:
    contract.student = student
    contract.status = ContractStatus.ACTIVE
    contract.save(update_fields=["student", "status", "updated_at"])
    create_notification(
        user=student.user,
        title="Contract assigned",
        message=f"You have been assigned to contract: {contract.title}",
        notification_type="CONTRACT_UPDATE",
        channel="BOTH",
    )
    return contract


@transaction.atomic
def create_milestones(contract: Contract, milestones_data: list[dict]):
    from apps.milestones.models import Milestone

    created = []
    existing_max_order = contract.milestones.aggregate(max_order=Max("order"))["max_order"] or 0
    for index, item in enumerate(milestones_data, start=1):
        milestone = Milestone.objects.create(
            contract=contract,
            title=item["title"],
            description=item["description"],
            amount=item["amount"],
            deadline=item["deadline"],
            order=item.get("order") or existing_max_order + index,
        )
        created.append(milestone)
    return created


@transaction.atomic
def add_milestones(contract: Contract, milestones_data: list[dict]):
    return create_milestones(contract, milestones_data)


@transaction.atomic
def cancel_contract(contract: Contract, reason: str = "") -> Contract:
    contract.status = ContractStatus.CANCELLED
    contract.cancelled_at = timezone.now()
    contract.notes = f"{contract.notes}\nCANCELLED: {reason}".strip()
    contract.save(update_fields=["status", "cancelled_at", "notes", "updated_at"])
    if contract.funded_amount > 0 and contract.released_amount < contract.funded_amount:
        # ==========================================
        # TODO FOR BLOCKCHAIN TEAM
        #
        # Refund Company
        #
        # refundFunds(contract_id)
        #
        # Blockchain teammate should implement this.
        # ==========================================
        pass
    return contract


@transaction.atomic
def fund_contract(contract: Contract, transaction_hash: str = "", reference: str = "") -> Contract:
    # ==========================================
    # TODO FOR BLOCKCHAIN TEAM
    #
    # Lock Escrow
    #
    # Smart Contract Function:
    # lockFunds(contract_id, amount)
    #
    # Blockchain teammate should implement this.
    # ==========================================
    contract.funded_amount = contract.total_amount
    contract.funded_at = timezone.now()
    contract.status = ContractStatus.FUNDED
    if transaction_hash:
        contract.chain_reference = transaction_hash
    elif reference:
        contract.chain_reference = reference
    contract.save(update_fields=["funded_amount", "funded_at", "status", "chain_reference", "updated_at"])
    return contract


def get_contract_dashboard(company) -> dict:
    qs = Contract.objects.filter(company=company)
    aggregates = qs.aggregate(
        total_contracts=Count("id"),
        active_contracts=Count("id", filter=Q(status__in=[ContractStatus.ACTIVE, ContractStatus.IN_PROGRESS, ContractStatus.FUNDED, ContractStatus.SUBMITTED])),
        funded_contracts=Count("id", filter=Q(status=ContractStatus.FUNDED)),
        disputed_contracts=Count("id", filter=Q(status=ContractStatus.DISPUTED)),
        completed_contracts=Count("id", filter=Q(status=ContractStatus.COMPLETED)),
        cancelled_contracts=Count("id", filter=Q(status=ContractStatus.CANCELLED)),
        total_value=Sum("total_amount"),
    )
    recent = list(
        qs.order_by("-created_at").values("id", "title", "status", "total_amount", "funded_amount", "created_at")[:5]
    )
    return {
        "total_contracts": aggregates["total_contracts"] or 0,
        "active_contracts": aggregates["active_contracts"] or 0,
        "funded_contracts": aggregates["funded_contracts"] or 0,
        "disputed_contracts": aggregates["disputed_contracts"] or 0,
        "completed_contracts": aggregates["completed_contracts"] or 0,
        "cancelled_contracts": aggregates["cancelled_contracts"] or 0,
        "total_value": aggregates["total_value"] or Decimal("0.00"),
        "recent_contracts": recent,
    }
