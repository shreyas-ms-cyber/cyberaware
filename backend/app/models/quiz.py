from app.extensions import db
from datetime import datetime

class QuizQuestion(db.Model):
    __tablename__ = 'quiz_questions'
    
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('training_modules.id'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    options_json = db.Column(db.JSON, nullable=False)
    correct_answer = db.Column(db.String(255), nullable=False)
    difficulty = db.Column(db.String(20), default='intermediate')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'module_id': self.module_id,
            'question': self.question,
            'options': self.options_json,
            'correct_answer': self.correct_answer,
            'difficulty': self.difficulty
        }
    
    def __repr__(self):
        return f'<QuizQuestion {self.id}>'
