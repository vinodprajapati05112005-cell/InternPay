from __future__ import annotations

from django.db import models

from apps.common.choices import AIAnalysisStatus, AIRecommendation, SubmissionStatus
from apps.common.models import BaseModel
from internpay.utils.files import submission_upload_path


class Submission(BaseModel):
    contract = models.ForeignKey(
        "contracts.Contract",
        on_delete=models.CASCADE,
        related_name="submissions",
    )
    milestone = models.OneToOneField(
        "milestones.Milestone",
        on_delete=models.CASCADE,
        related_name="submission",
    )
    student = models.ForeignKey(
        "students.Student",
        on_delete=models.CASCADE,
        related_name="submissions",
    )
    github_url = models.URLField(blank=True, default="")
    demo_url = models.URLField(blank=True, default="")
    figma_url = models.URLField(blank=True, default="")
    documentation_url = models.URLField(blank=True, default="")
    video_url = models.URLField(blank=True, default="")
    additional_notes = models.TextField(blank=True, default="")
    status = models.CharField(max_length=30, choices=SubmissionStatus.choices, default=SubmissionStatus.DRAFT, db_index=True)
    submitted_at = models.DateTimeField(auto_now_add=True, db_index=True)
    evaluated_at = models.DateTimeField(null=True, blank=True, db_index=True)
    transaction_hash = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        indexes = [
            models.Index(fields=["contract", "status"]),
            models.Index(fields=["student", "status"]),
            models.Index(fields=["submitted_at", "status"]),
        ]

    def __str__(self) -> str:
        return f"{self.contract.title} - {self.milestone.title}"


class SubmissionFile(BaseModel):
    submission = models.ForeignKey(
        "submissions.Submission",
        on_delete=models.CASCADE,
        related_name="files",
    )
    file = models.FileField(upload_to=submission_upload_path)
    file_type = models.CharField(max_length=50, blank=True, default="")
    original_name = models.CharField(max_length=255, blank=True, default="")
    file_size = models.PositiveBigIntegerField(default=0)

    def __str__(self) -> str:
        return self.original_name or self.file.name


class AIReport(BaseModel):
    submission = models.OneToOneField(
        "submissions.Submission",
        on_delete=models.CASCADE,
        related_name="ai_report",
    )
    code_score = models.PositiveIntegerField(default=0)
    design_score = models.PositiveIntegerField(default=0)
    requirement_score = models.PositiveIntegerField(default=0)
    functionality_score = models.PositiveIntegerField(default=0)
    overall_score = models.PositiveIntegerField(default=0, db_index=True)
    strengths = models.JSONField(default=list, blank=True)
    weaknesses = models.JSONField(default=list, blank=True)
    recommendation = models.CharField(max_length=30, choices=AIRecommendation.choices, default=AIRecommendation.HUMAN_REVIEW, db_index=True)
    explanation = models.TextField(blank=True, default="")
    raw_response = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=30, choices=AIAnalysisStatus.choices, default=AIAnalysisStatus.PENDING, db_index=True)
    model_version = models.CharField(max_length=120, blank=True, default="")
    evaluated_at = models.DateTimeField(null=True, blank=True, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=["overall_score", "recommendation"]),
            models.Index(fields=["status", "evaluated_at"]),
        ]

    def __str__(self) -> str:
        return f"AI Report for {self.submission_id}"
