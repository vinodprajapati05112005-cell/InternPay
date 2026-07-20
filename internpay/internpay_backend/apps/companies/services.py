from __future__ import annotations

from django.db.models import Count, F, Q, Sum

from apps.companies.models import Company


def get_company_dashboard(company: Company) -> dict:
    from apps.contracts.models import Contract

    qs = Contract.objects.filter(company=company)
    aggregates = qs.aggregate(
        total_contracts=Count("id"),
        active_contracts=Count("id", filter=Q(status__in=["ACTIVE", "IN_PROGRESS", "FUNDED", "SUBMITTED"])),
        funded_contracts=Count("id", filter=Q(funded_amount__gte=F("total_amount"))),
        completed_contracts=Count("id", filter=Q(status="COMPLETED")),
        disputed_contracts=Count("id", filter=Q(status="DISPUTED")),
        total_spent=Sum("released_amount"),
    )
    recent_contracts = []
    for contract in qs.select_related("student__user", "judge__user").prefetch_related("milestones").order_by("-created_at")[:5]:
        milestones = list(contract.milestones.all())
        total_milestones = len(milestones)
        completed_milestones = len([milestone for milestone in milestones if milestone.status == "APPROVED"])
        progress_percent = round((completed_milestones / total_milestones) * 100, 2) if total_milestones else 0
        recent_contracts.append(
            {
                "id": str(contract.id),
                "title": contract.title,
                "status": contract.status,
                "total_amount": contract.total_amount,
                "funded_amount": contract.funded_amount,
                "released_amount": contract.released_amount,
                "deadline": contract.deadline,
                "created_at": contract.created_at,
                "student_name": (
                    contract.student.user.get_full_name() or contract.student.user.email
                    if contract.student
                    else None
                ),
                "milestone_count": total_milestones,
                "completed_milestones": completed_milestones,
                "progress_percent": progress_percent,
            }
        )
    return {
        "total_contracts": aggregates["total_contracts"] or 0,
        "active_contracts": aggregates["active_contracts"] or 0,
        "funded_contracts": aggregates["funded_contracts"] or 0,
        "completed_contracts": aggregates["completed_contracts"] or 0,
        "disputed_contracts": aggregates["disputed_contracts"] or 0,
        "total_spent": aggregates["total_spent"] or 0,
        "recent_contracts": recent_contracts,
    }


def update_company_profile(company: Company, data: dict) -> Company:
    for field in [
        "company_name",
        "company_website",
        "company_registration_number",
        "company_industry",
        "company_address",
        "description",
        "team_size",
    ]:
        if field in data:
            setattr(company, field, data[field])
    company.save()
    return company
