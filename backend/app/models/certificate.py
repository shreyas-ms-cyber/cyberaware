from app.extensions import db
from datetime import datetime
import secrets

class Certificate(db.Model):
    __tablename__ = 'certificates'
    
    id = db.Column(db.Integer, primary_key=True)
    certificate_id = db.Column(db.String(64), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __init__(self, name, score):
        self.certificate_id = self.generate_certificate_id()
        self.name = name
        self.score = score
    
    @staticmethod
    def generate_certificate_id():
        # Generate a cryptographically random certificate ID
        return secrets.token_urlsafe(32)[:48]
    
    def to_dict(self):
        return {
            'certificate_id': self.certificate_id,
            'name': self.name,
            'score': self.score,
            'issued_at': self.issued_at.isoformat() if self.issued_at else None
        }
    
    def __repr__(self):
        return f'<Certificate {self.certificate_id}>'
