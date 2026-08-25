from app.extensions import db
from datetime import datetime

class TrainingModule(db.Model):
    __tablename__ = 'training_modules'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    module_order = db.Column(db.Integer, nullable=False)
    content_json = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    quiz_questions = db.relationship('QuizQuestion', backref='module', lazy=True)
    scenarios = db.relationship('Scenario', backref='module', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'module_order': self.module_order,
            'content': self.content_json,
            'quiz_count': len(self.quiz_questions),
            'scenario_count': len(self.scenarios)
        }
    
    def __repr__(self):
        return f'<TrainingModule {self.title}>'
