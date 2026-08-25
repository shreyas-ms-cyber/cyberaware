import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///cyberaware.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Gemini AI
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-2.0-flash')
    
    # CORS - Allow multiple origins
    CORS_ORIGIN = os.getenv('CORS_ORIGIN', '*')
    if CORS_ORIGIN == '*':
        CORS_ORIGINS = ['*']
    else:
        CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGIN.split(',')]
    
    # Flask
    FLASK_ENV = os.getenv('FLASK_ENV', 'production')
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Rate Limiting
    RATELIMIT_DEFAULT = os.getenv('RATELIMIT_DEFAULT', '100 per hour')
    RATELIMIT_STORAGE_URL = os.getenv('RATELIMIT_STORAGE_URL', 'memory://')
    
    # Certificate
    CERTIFICATE_DISCLAIMER = "Demo certificate for portfolio/educational purposes — not an accredited credential."
