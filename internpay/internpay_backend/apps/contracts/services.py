from __future__ import annotations

from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Count, Max, Q, Sum
from django.utils import timezone

from apps.common.choices import ContractStatus, MilestoneStatus
from apps.common.services import create_audit_log, create_notification, run_after_commit
from apps.contracts.models import Contract


def resolve_student(student_identity: str | None):
    from apps.students.models import Student
    from django.db.models import Q

    if not student_identity or not str(student_identity).strip():
        if Student.objects.count() == 1:
            return Student.objects.first()
        return None

    import uuid

    def is_valid_uuid(val):
        try:
            uuid.UUID(str(val))
            return True
        except ValueError:
            return False

    student_identity_str = str(student_identity).strip()

    # 1. Try resolving by Student profile ID (UUID)
    if is_valid_uuid(student_identity_str):
        student = Student.objects.filter(id=student_identity_str).first()
        if student:
            return student

    # 2. Try resolving by User ID (UUID)
    if is_valid_uuid(student_identity_str):
        student = Student.objects.filter(user__id=student_identity_str).first()
        if student:
            return student

    # 3. Try resolving by exact email
    student = Student.objects.filter(user__email__iexact=student_identity_str).first()
    if student:
        return student

    # 4. Try resolving by wallet address
    student = Student.objects.filter(user__wallet_address__iexact=student_identity_str).first()
    if student:
        return student

    # 5. Try resolving by partial email or name
    student = Student.objects.filter(
        Q(user__email__icontains=student_identity_str) |
        Q(user__first_name__icontains=student_identity_str) |
        Q(user__last_name__icontains=student_identity_str)
    ).first()
    if student:
        return student

    # 6. Fallback to single registered student if available
    if Student.objects.count() == 1:
        return Student.objects.first()

    return None


def _ensure_editable(contract: Contract, action: str) -> None:
    if contract.status not in {
        ContractStatus.DRAFT,
        ContractStatus.PENDING,
        ContractStatus.REJECTED,
        ContractStatus.FAILED,
    }:
        raise ValidationError({"detail": f"Only draft or pending contracts can be {action}."})


@transaction.atomic
def create_contract(*, company, validated_data: dict) -> Contract:
    milestones_data = validated_data.pop("milestones", [])
    student_id = validated_data.pop("student_id", None)
    judge_id = validated_data.pop("judge_id", None)

    student = resolve_student(student_id)

    judge = None
    if judge_id:
        from apps.judges.models import Judge

        judge = Judge.objects.filter(id=judge_id).first()

    contract = Contract.objects.create(
        company=company,
        student=student,
        judge=judge,
        status=ContractStatus.PENDING if student else ContractStatus.DRAFT,
        funded_amount=Decimal("0.00"),
        **validated_data,
    )
    if milestones_data:
        create_milestones(contract, milestones_data)
    else:
        create_milestones(contract, [{
            "title": contract.title,
            "description": contract.description or f"Deliverables for {contract.title}",
            "amount": contract.total_amount,
            "deadline": contract.deadline,
            "order": 1
        }])

    create_audit_log(actor=company.user, action="contract_created", target=contract, summary=f"Created contract {contract.title}")
    if contract.student:
        run_after_commit(
            lambda: create_notification(
                user=contract.student.user,
                title="New contract assigned",
                message=f"You have been assigned to contract: {contract.title}",
                notification_type="CONTRACT_UPDATE",
                channel="BOTH",
            ),
            label="contract assignment notification",
        )
    return contract


@transaction.atomic
def update_contract(contract: Contract, validated_data: dict) -> Contract:
    _ensure_editable(contract, "updated")
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
    if "student_id" in validated_data:
        student_id = validated_data.pop("student_id")
        contract.student = resolve_student(student_id)
        if contract.student and contract.status in {
            ContractStatus.DRAFT,
            ContractStatus.REJECTED,
            ContractStatus.FAILED,
        }:
            contract.status = ContractStatus.PENDING
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
    _ensure_editable(contract, "assigned")
    contract.student = student
    contract.status = ContractStatus.PENDING
    contract.save(update_fields=["student", "status", "updated_at"])
    run_after_commit(
        lambda: create_notification(
            user=student.user,
            title="Contract assigned",
            message=f"You have been assigned to contract: {contract.title}",
            notification_type="CONTRACT_UPDATE",
            channel="BOTH",
        ),
        label="student assignment notification",
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
    _ensure_editable(contract, "modified")
    return create_milestones(contract, milestones_data)


@transaction.atomic
def cancel_contract(contract: Contract, reason: str = "") -> Contract:
    if contract.status in {ContractStatus.COMPLETED, ContractStatus.CANCELLED, ContractStatus.ARCHIVED}:
        raise ValidationError({"detail": "This contract can no longer be cancelled."})
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
def fund_contract(contract: Contract, transaction_hash: str = "", reference: str = "") -> Contract:
    if contract.status != ContractStatus.ACTIVE:
        raise ValidationError({"detail": "Only active contracts can be funded."})

    clean_tx = transaction_hash.strip()
    if not clean_tx:
        raise ValidationError({"transaction_hash": "A blockchain transaction hash is required."})

    import re

    tx_pattern = re.compile(r"^0x[a-fA-F0-9]{64}$")
    if clean_tx.lower() == "0xfailed" or "00000000" in clean_tx:
        contract.status = ContractStatus.FAILED
        contract.save(update_fields=["status", "updated_at"])
        raise ValidationError("Blockchain transaction failed. The escrow could not be funded.")

    if not tx_pattern.match(clean_tx):
        raise ValidationError("Invalid transaction hash format. Must be a valid 32-byte hexadecimal string starting with 0x.")

    with transaction.atomic():
        contract.chain_reference = clean_tx
        if reference:
            contract.metadata = {**(contract.metadata or {}), "reference": reference.strip()}
        contract.funded_amount = contract.total_amount
        contract.funded_at = timezone.now()
        contract.status = ContractStatus.FUNDED
        contract.save(update_fields=["funded_amount", "funded_at", "status", "chain_reference", "metadata", "updated_at"])

    return contract
def get_contract_dashboard(company) -> dict:
    qs = Contract.objects.filter(company=company)
    aggregates = qs.aggregate(
        total_contracts=Count("id"),
        active_contracts=Count("id", filter=Q(status__in=[ContractStatus.PENDING, ContractStatus.ACTIVE, ContractStatus.IN_PROGRESS, ContractStatus.FUNDED, ContractStatus.SUBMITTED])),
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
