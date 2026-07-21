from django.db import models


class UserRole(models.TextChoices):
    ADMIN = "ADMIN", "Admin"
    COMPANY = "COMPANY", "Company"
    STUDENT = "STUDENT", "Student"
    JUDGE = "JUDGE", "Judge"


class VerificationStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    VERIFIED = "VERIFIED", "Verified"
    REJECTED = "REJECTED", "Rejected"
    SUSPENDED = "SUSPENDED", "Suspended"


class ContractStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    PENDING = "PENDING", "Pending"
    REJECTED = "REJECTED", "Rejected"
    FAILED = "FAILED", "Failed"
    ACTIVE = "ACTIVE", "Active"
    FUNDING_REQUIRED = "FUNDING_REQUIRED", "Funding Required"
    FUNDED = "FUNDED", "Funded"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    SUBMITTED = "SUBMITTED", "Submitted"
    DISPUTED = "DISPUTED", "Disputed"
    COMPLETED = "COMPLETED", "Completed"
    CANCELLED = "CANCELLED", "Cancelled"
    ARCHIVED = "ARCHIVED", "Archived"
    EXPIRED = "EXPIRED", "Expired"



class MilestoneStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    SUBMITTED = "SUBMITTED", "Submitted"
    UNDER_REVIEW = "UNDER_REVIEW", "Under Review"
    APPROVED = "APPROVED", "Approved"
    REJECTED = "REJECTED", "Rejected"
    CANCELLED = "CANCELLED", "Cancelled"


class SubmissionStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    SUBMITTED = "SUBMITTED", "Submitted"
    EVALUATING = "EVALUATING", "Evaluating"
    APPROVED = "APPROVED", "Approved"
    APPROVED_WITH_NOTES = "APPROVED_WITH_NOTES", "Approved With Notes"
    HUMAN_REVIEW = "HUMAN_REVIEW", "Human Review"
    REJECTED = "REJECTED", "Rejected"
    DISPUTED = "DISPUTED", "Disputed"
    RESOLVED = "RESOLVED", "Resolved"


class AIRecommendation(models.TextChoices):
    APPROVED = "APPROVED", "Approved"
    APPROVED_WITH_NOTES = "APPROVED_WITH_NOTES", "Approved With Notes"
    HUMAN_REVIEW = "HUMAN_REVIEW", "Human Review"
    REJECTED = "REJECTED", "Rejected"


class AIAnalysisStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    COMPLETED = "COMPLETED", "Completed"
    FAILED = "FAILED", "Failed"


class DisputeStatus(models.TextChoices):
    OPEN = "OPEN", "Open"
    ASSIGNED = "ASSIGNED", "Assigned"
    UNDER_REVIEW = "UNDER_REVIEW", "Under Review"
    PARTIALLY_RESOLVED = "PARTIALLY_RESOLVED", "Partially Resolved"
    RESOLVED = "RESOLVED", "Resolved"
    REJECTED = "REJECTED", "Rejected"
    EXPIRED = "EXPIRED", "Expired"
    CLOSED = "CLOSED", "Closed"


class DisputeReason(models.TextChoices):
    UNFAIR_EVALUATION = "UNFAIR_EVALUATION", "Unfair Evaluation"
    SCOPE_MISMATCH = "SCOPE_MISMATCH", "Scope Mismatch"
    INCOMPLETE_WORK = "INCOMPLETE_WORK", "Incomplete Work"
    COMMUNICATION_BREAKDOWN = "COMMUNICATION_BREAKDOWN", "Communication Breakdown"
    PAYMENT_ISSUE = "PAYMENT_ISSUE", "Payment Issue"
    OTHER = "OTHER", "Other"


class DisputeDecision(models.TextChoices):
    RELEASE_PAYMENT = "RELEASE_PAYMENT", "Release Payment"
    REFUND_COMPANY = "REFUND_COMPANY", "Refund Company"
    PARTIAL_PAYMENT = "PARTIAL_PAYMENT", "Partial Payment"


class NotificationType(models.TextChoices):
    SUBMISSION_RECEIVED = "SUBMISSION_RECEIVED", "Submission Received"
    AI_REPORT_READY = "AI_REPORT_READY", "AI Report Ready"
    DISPUTE_CREATED = "DISPUTE_CREATED", "Dispute Created"
    JUDGE_ASSIGNED = "JUDGE_ASSIGNED", "Judge Assigned"
    DECISION_COMPLETED = "DECISION_COMPLETED", "Decision Completed"
    PASSWORD_RESET = "PASSWORD_RESET", "Password Reset"
    EMAIL_VERIFICATION = "EMAIL_VERIFICATION", "Email Verification"
    CONTRACT_UPDATE = "CONTRACT_UPDATE", "Contract Update"
    GENERAL = "GENERAL", "General"


class NotificationChannel(models.TextChoices):
    IN_APP = "IN_APP", "In App"
    EMAIL = "EMAIL", "Email"
    BOTH = "BOTH", "Both"
