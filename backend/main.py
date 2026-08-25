import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.extensions import db, limiter

print(f"Python version: {sys.version}")
print("Starting CyberAware Backend...")

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    print(f"Database URL: {app.config.get('SQLALCHEMY_DATABASE_URI', 'Not set')}")
    
    # Initialize CORS
    cors_origin = app.config.get('CORS_ORIGIN', '*')
    CORS(app, origins=cors_origin, supports_credentials=True)
    print(f"CORS configured for: {cors_origin}")
    
    # Initialize database
    try:
        db.init_app(app)
        with app.app_context():
            db.create_all()
            print("✅ Database tables created successfully")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
    
    limiter.init_app(app)
    
    # Register routes
    try:
        from app.routes import health, modules, quizzes, scenarios, certificates, chat, quiz_generate
        app.register_blueprint(health.bp)
        app.register_blueprint(modules.bp)
        app.register_blueprint(quizzes.bp)
        app.register_blueprint(scenarios.bp)
        app.register_blueprint(certificates.bp)
        app.register_blueprint(chat.bp)
        app.register_blueprint(quiz_generate.bp)
        print("✅ All routes registered successfully")
    except ImportError as e:
        print(f"⚠️ Warning: Could not import routes: {e}")
    
    # Seed endpoint
    @app.route('/api/seed')
    def seed_database():
        try:
            from app.models import TrainingModule, QuizQuestion, Scenario
            import json
            
            # Check if data already exists
            if TrainingModule.query.count() > 0:
                return jsonify({'success': True, 'message': 'Database already seeded'})
            
            # Create modules
            modules_data = [
                {
                    "title": "Password Security",
                    "module_order": 1,
                    "content_json": {
                        "description": "Learn how to create and manage strong, secure passwords.",
                        "learning_objectives": [
                            "Understand password strength factors",
                            "Learn to create memorable strong passwords",
                            "Recognize password reuse risks",
                            "Implement password management best practices"
                        ],
                        "content": [
                            {
                                "type": "text",
                                "title": "Why Password Security Matters",
                                "body": "Passwords are the first line of defense against unauthorized access."
                            },
                            {
                                "type": "text",
                                "title": "Characteristics of Strong Passwords",
                                "body": "A strong password should be: At least 12 characters long, use a mix of uppercase and lowercase letters, include numbers and special characters."
                            }
                        ],
                        "real_world_example": {
                            "title": "The 2020 Credential Stuffing Attack",
                            "description": "In 2020, a major attack used passwords stolen from one service to access accounts on other services."
                        }
                    }
                },
                {
                    "title": "Phishing & Social Engineering",
                    "module_order": 2,
                    "content_json": {
                        "description": "Identify and defend against phishing attacks and social engineering tactics.",
                        "learning_objectives": [
                            "Recognize common phishing techniques",
                            "Identify social engineering red flags",
                            "Understand how attackers manipulate human psychology"
                        ],
                        "content": [
                            {
                                "type": "text",
                                "title": "What is Phishing?",
                                "body": "Phishing is a cyber attack where criminals attempt to trick you into revealing sensitive information."
                            }
                        ],
                        "real_world_example": {
                            "title": "The 2021 Business Email Compromise",
                            "description": "A sophisticated phishing campaign targeted executives using deepfake voice technology."
                        }
                    }
                },
                {
                    "title": "Multi-Factor Authentication",
                    "module_order": 3,
                    "content_json": {
                        "description": "Understand and implement multi-factor authentication to enhance account security.",
                        "learning_objectives": [
                            "Understand what MFA is and why it matters",
                            "Learn about different MFA factors",
                            "Implement MFA on key accounts"
                        ],
                        "content": [
                            {
                                "type": "text",
                                "title": "What is MFA?",
                                "body": "Multi-Factor Authentication requires two or more verification factors to access an account."
                            }
                        ],
                        "real_world_example": {
                            "title": "The 2022 Cloud Account Breach",
                            "description": "An organization experienced a breach because MFA was not enabled on critical accounts."
                        }
                    }
                }
            ]
            
            for mod_data in modules_data:
                module = TrainingModule(**mod_data)
                db.session.add(module)
            db.session.commit()
            
            # Add some quiz questions
            quiz_data = [
                {"module_id": 1, "question": "What is the minimum recommended length for a strong password?", 
                 "options_json": ["6 characters", "8 characters", "12 characters", "16 characters"], 
                 "correct_answer": "12 characters", "difficulty": "beginner"},
                {"module_id": 1, "question": "Which of the following is an example of a strong password?", 
                 "options_json": ["password123", "B3stP@ssw0rd!", "12345678", "qwerty"], 
                 "correct_answer": "B3stP@ssw0rd!", "difficulty": "beginner"},
                {"module_id": 2, "question": "What is phishing?", 
                 "options_json": ["An attack that tricks users", "A type of computer virus", "A hardware failure", "A network error"], 
                 "correct_answer": "An attack that tricks users", "difficulty": "beginner"},
                {"module_id": 3, "question": "What does MFA stand for?", 
                 "options_json": ["Multi-Factor Authentication", "Main Frame Access", "Mobile File Access", "Master File Authentication"], 
                 "correct_answer": "Multi-Factor Authentication", "difficulty": "beginner"}
            ]
            
            for q in quiz_data:
                question = QuizQuestion(**q)
                db.session.add(question)
            db.session.commit()
            
            return jsonify({'success': True, 'message': 'Database seeded successfully'})
            
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': {'message': 'Resource not found', 'code': 'NOT_FOUND'}
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'success': False,
            'error': {'message': 'Internal server error', 'code': 'INTERNAL_ERROR'}
        }), 500
    
    return app

app = create_app()

@app.route('/')
def index():
    return jsonify({
        'service': 'CyberAware API',
        'version': '1.0.0',
        'status': 'running',
        'endpoints': {
            'health': '/api/health',
            'modules': '/api/modules',
            'seed': '/api/seed',
            'quizzes': '/api/quizzes/<module_id>',
            'scenarios': '/api/scenarios/<module_id>',
            'chat': '/api/chat',
            'certificate': '/api/certificate'
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
