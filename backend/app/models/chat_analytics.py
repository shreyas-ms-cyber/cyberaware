from app.extensions import db
from datetime import datetime

class ChatAnalytics(db.Model):
    __tablename__ = 'chat_analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    module_context = db.Column(db.String(100), nullable=True)
    message_count = db.Column(db.Integer, default=1)
    
    def __repr__(self):
        return f'<ChatAnalytics {self.id}>'
