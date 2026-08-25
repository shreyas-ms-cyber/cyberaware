# Import all models so they register with the same metadata
from app.models.module import TrainingModule
from app.models.quiz import QuizQuestion
from app.models.scenario import Scenario
from app.models.certificate import Certificate
from app.models.chat_analytics import ChatAnalytics

# Export all models
__all__ = [
    'TrainingModule',
    'QuizQuestion',
    'Scenario',
    'Certificate',
    'ChatAnalytics'
]
