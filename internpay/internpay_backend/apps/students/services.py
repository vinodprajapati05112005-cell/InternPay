from __future__ import annotations

from decimal import Decimal

from django.db.models import Count, Q, Sum

from apps.students.models import Student


def _claim_unassigned_contracts(student: Student) -> None:
    """Auto-assign any contract without a student to the current student.
    Also converts DRAFT → PENDING so the student can see & act on the contract."""
    from apps.contracts.models import Contract
    from apps.common.choices import ContractStatus

    # Bulk-claim contracts that belong to this student's company but have no student yet
    unassigned = list(Contract.objects.filter(student__isnull=True))
    for c in unassigned:
        c.student = student
        if c.status == ContractStatus.DRAFT:
            c.status = ContractStatus.PENDING
        c.save(update_fields=["student", "status", "updated_at"])

    # Fix any remaining DRAFT contracts already assigned to this student
    Contract.objects.filter(student=student, status=ContractStatus.DRAFT).update(
        status=ContractStatus.PENDING
    )


def update_student_profile(student: Student, data: dict) -> Student:
    for field in [
        "institution_name",
        "course_name",
        "graduation_year",
        "portfolio_url",
        "skills",
        "bio",
    ]:
        if field in data:
            setattr(student, field, data[field])
    student.save()
    return student


def get_student_dashboard(student: Student) -> dict:
    from apps.contracts.models import Contract
    from apps.submissions.models import Submission

    _claim_unassigned_contracts(student)

    contracts = Contract.objects.filter(student=student)
    submissions = Submission.objects.select_related("contract", "milestone", "ai_report").filter(student=student)
    total_amount = contracts.aggregate(total=Sum("total_amount"))["total"] or Decimal("0.00")
    released_amount = contracts.aggregate(released=Sum("released_amount"))["released"] or Decimal("0.00")
    aggregates = contracts.aggregate(
        total_contracts=Count("id"),
        active_contracts=Count("id", filter=Q(status__in=["ACTIVE", "IN_PROGRESS", "FUNDED", "SUBMITTED"])),
    )
    recent_submissions = []
    for submission in submissions.order_by("-created_at")[:5]:
        try:
            ai_report = submission.ai_report
        except Exception:
            ai_report = None
        recent_submissions.append(
            {
                "id": str(submission.id),
                "contract_id": str(submission.contract_id),
                "contract_title": submission.contract.title,
                "milestone_id": str(submission.milestone_id),
                "milestone_title": submission.milestone.title,
                "status": submission.status,
                "submitted_at": submission.submitted_at,
                "evaluated_at": submission.evaluated_at,
                "ai_score": ai_report.overall_score if ai_report else None,
                "ai_recommendation": ai_report.recommendation if ai_report else None,
            }
        )
    return {
        "total_contracts": aggregates["total_contracts"] or 0,
        "active_contracts": aggregates["active_contracts"] or 0,
        "submitted_work": submissions.count(),
        "approved_submissions": submissions.filter(status="APPROVED").count(),
        "rejected_submissions": submissions.filter(status="REJECTED").count(),
        "pending_payments": max(total_amount - released_amount, Decimal("0.00")),
        "recent_submissions": recent_submissions,
    }


def get_student_contracts(student: Student) -> list[dict]:
    from apps.contracts.models import Contract

    _claim_unassigned_contracts(student)

    payload = []
    for contract in Contract.objects.filter(student=student).select_related("company__user").prefetch_related("milestones").order_by("-created_at"):
        milestones = list(contract.milestones.all())
        if not milestones:
            from apps.milestones.models import Milestone
            default_m = Milestone.objects.create(
                contract=contract,
                title=contract.title,
                description=contract.description or f"Deliverables for {contract.title}",
                amount=contract.total_amount,
                deadline=contract.deadline,
                order=1,
            )
            milestones = [default_m]
        total_milestones = len(milestones)
        completed_milestones = len([milestone for milestone in milestones if milestone.status == "APPROVED"])
        progress_percent = round((completed_milestones / total_milestones) * 100, 2) if total_milestones else 0
        payload.append(
            {
                "id": str(contract.id),
                "title": contract.title,
                "status": contract.status,
                "total_amount": contract.total_amount,
                "funded_amount": contract.funded_amount,
                "released_amount": contract.released_amount,
                "company_name": contract.company.company_name or contract.company.user.get_full_name() or contract.company.user.email,
                "deadline": contract.deadline,
                "milestone_count": total_milestones,
                "completed_milestones": completed_milestones,
                "progress_percent": progress_percent,
                "created_at": contract.created_at,
            }
        )
    return payload


def get_student_payments(student: Student) -> list[dict]:
    from apps.contracts.models import Contract

    contracts = Contract.objects.filter(student=student)
    payload = []
    for contract in contracts:
        pending_amount = max(contract.total_amount - contract.released_amount, Decimal("0.00"))
        payload.append(
            {
                "contract_id": str(contract.id),
                "contract_title": contract.title,
                "total_amount": contract.total_amount,
                "funded_amount": contract.funded_amount,
                "released_amount": contract.released_amount,
                "pending_amount": pending_amount,
                "status": contract.status,
            }
        )
    return payload
