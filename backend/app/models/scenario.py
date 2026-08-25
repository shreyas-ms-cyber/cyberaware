from app.extensions import db
from datetime import datetime

class Scenario(db.Model):
    __tablename__ = 'scenarios'
    
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('training_modules.id'), nullable=False)
    scenario_content = db.Column(db.JSON, nullable=False)
    options_json = db.Column(db.JSON, nullable=False)
    correct_answer = db.Column(db.String(255), nullable=False)
    explanation = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'module_id': self.module_id,
            'scenario': self.scenario_content,
            'options': self.options_json,
            'correct_answer': self.correct_answer,
            'explanation': self.explanation
        }
    
    def __repr__(self):
        return f'<Scenario {self.id}>'
