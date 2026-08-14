from django.test import SimpleTestCase

from apps.ai_engine.services import _normalize_report
from apps.common.choices import AIRecommendation
from apps.common.services import recommendation_from_score


class AIEnginePolicyTests(SimpleTestCase):
    def test_low_scores_fall_back_to_human_review(self):
        self.assertEqual(recommendation_from_score(54), AIRecommendation.HUMAN_REVIEW)

        normalized = _normalize_report(
            {
                "overall_score": 54,
                "recommendation": AIRecommendation.REJECTED,
                "status": "COMPLETED",
            }
        )

        self.assertEqual(normalized["recommendation"], AIRecommendation.HUMAN_REVIEW)
