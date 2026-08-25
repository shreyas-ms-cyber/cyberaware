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
    
    # Initialize extensions
    cors_origin = app.config.get('CORS_ORIGIN', '*')
    CORS(app, origins=cors_origin, supports_credentials=True)
    print(f"CORS configured for: {cors_origin}")
    
    db.init_app(app)
    limiter.init_app(app)
    
    # IMPORTANT: Import ALL models BEFORE create_all()
    # This ensures they are registered with the same metadata
    from app.models import TrainingModule, QuizQuestion, Scenario, Certificate, ChatAnalytics
    
    # Create tables
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully")
        
        # Verify tables exist
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        table_names = inspector.get_table_names()
        print(f"📊 Tables in database: {table_names}")
        
        # Check if training_modules exists
        if 'training_modules' in table_names:
            print("✅ training_modules table exists")
            count = TrainingModule.query.count()
            print(f"📊 training_modules row count: {count}")
        else:
            print("❌ training_modules table NOT found!")
    
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
    @app.route('/api/seed', methods=['GET'])
    def seed_database():
        try:
            from app.models import TrainingModule, QuizQuestion, Scenario
            
            # Check if data already exists
            existing_count = TrainingModule.query.count()
            if existing_count > 0:
                return jsonify({
                    'success': True, 
                    'message': 'Database already seeded',
                    'existing_modules': existing_count,
                    'total_quizzes': QuizQuestion.query.count(),
                    'total_scenarios': Scenario.query.count()
                })
            
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
                            }
                        ],
                        "real_world_example": {
                            "title": "The 2020 Credential Stuffing Attack",
                            "description": "In 2020, a major attack used passwords stolen from one service."
                        }
                    }
                },
                {
                    "title": "Phishing & Social Engineering",
                    "module_order": 2,
                    "content_json": {
                        "description": "Identify and defend against phishing attacks.",
                        "learning_objectives": [
                            "Recognize common phishing techniques",
                            "Identify social engineering red flags"
                        ],
                        "content": [
                            {
                                "type": "text",
                                "title": "What is Phishing?",
                                "body": "Phishing is a cyber attack where criminals attempt to trick you."
                            }
                        ],
                        "real_world_example": {
                            "title": "The 2021 Business Email Compromise",
                            "description": "A sophisticated phishing campaign targeted executives."
                        }
                    }
                },
                {
                    "title": "Multi-Factor Authentication",
                    "module_order": 3,
                    "content_json": {
                        "description": "Understand MFA to enhance account security.",
                        "learning_objectives": [
                            "Understand what MFA is",
                            "Learn about different MFA factors"
                        ],
                        "content": [
                            {
                                "type": "text",
                                "title": "What is MFA?",
                                "body": "MFA requires two or more verification factors."
                            }
                        ],
                        "real_world_example": {
                            "title": "The 2022 Cloud Account Breach",
                            "description": "An organization experienced a breach because MFA was not enabled."
                        }
                    }
                }
            ]
            
            for mod_data in modules_data:
                module = TrainingModule(**mod_data)
                db.session.add(module)
            db.session.commit()
            
            # Add quiz questions
            quiz_data = [
                {"module_id": 1, "question": "What is the minimum recommended length for a strong password?", 
                 "options_json": ["6 characters", "8 characters", "12 characters", "16 characters"], 
                 "correct_answer": "12 characters", "difficulty": "beginner"},
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
            
            # Add scenarios
            scenario_data = [
                {
                    "module_id": 1,
                    "scenario_content": {
                        "title": "Password Reset Scam",
                        "description": "You receive an email claiming your password has expired."
                    },
                    "options_json": [
                        "Click the link and reset your password",
                        "Ignore the email",
                        "Go directly to the service's website",
                        "Forward the email"
                    ],
                    "correct_answer": "Go directly to the service's website",
                    "explanation": "Always navigate to the official website directly."
                },
                {
                    "module_id": 2,
                    "scenario_content": {
                        "title": "Urgent Email from CEO",
                        "description": "You receive an email from your CEO asking for sensitive data."
                    },
                    "options_json": [
                        "Send the data immediately",
                        "Reply asking for a form",
                        "Verify through a different channel",
                        "Forward to all employees"
                    ],
                    "correct_answer": "Verify through a different channel",
                    "explanation": "Always verify sensitive requests through official channels."
                }
            ]
            
            for s in scenario_data:
                scenario = Scenario(**s)
                db.session.add(scenario)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Database seeded successfully',
                'modules': TrainingModule.query.count(),
                'quizzes': QuizQuestion.query.count(),
                'scenarios': Scenario.query.count()
            })
            
        except Exception as e:
            db.session.rollback()
            return jsonify({
                'success': False,
                'error': str(e),
                'type': type(e).__name__
            }), 500
    
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
            'scenarios': '/api/scenarios/<module_id>'
        }
    })

@app.route('/api/test')
def test():
    return jsonify({'status': 'ok', 'message': 'API is working'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
