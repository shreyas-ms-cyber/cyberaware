import os
import sys
from flask import Flask, jsonify, request
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
    
    # Import models
    from app.models import TrainingModule, QuizQuestion, Scenario, Certificate, ChatAnalytics
    
    # Seed endpoint
    @app.route('/api/seed', methods=['GET'])
    def seed_database():
        try:
            # Check if data already exists
            if TrainingModule.query.count() > 0:
                return jsonify({
                    'success': True, 
                    'message': 'Database already seeded',
                    'count': TrainingModule.query.count()
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
                                "body": "Passwords are the first line of defense against unauthorized access. Weak passwords can be cracked in seconds."
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
                                "body": "Phishing is a cyber attack where criminals attempt to trick you into revealing sensitive information by posing as legitimate entities."
                            },
                            {
                                "type": "text",
                                "title": "Common Phishing Techniques",
                                "body": "Email spoofing, spear phishing, whaling, vishing (voice phishing), and smishing (SMS phishing) are all common techniques."
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
                            },
                            {
                                "type": "text",
                                "title": "The Three Factors",
                                "body": "Something you know (password), something you have (phone/security key), and something you are (biometrics)."
                            }
                        ],
                        "real_world_example": {
                            "title": "The 2022 Cloud Account Breach",
                            "description": "An organization experienced a breach because MFA was not enabled on critical accounts."
                        }
                    }
                },
                {
                    "title": "Email Security",
                    "module_order": 4,
                    "content_json": {
                        "description": "Secure your email communications and protect against email-based threats.",
                        "learning_objectives": [
                            "Implement email security best practices",
                            "Recognize malicious emails",
                            "Secure email attachments"
                        ],
                        "content": [
                            {
                                "type": "text",
                                "title": "Email Security Best Practices",
                                "body": "Use secure email providers, enable two-factor authentication, be cautious with attachments."
                            }
                        ],
                        "real_world_example": {
                            "title": "The 2021 Email Spoofing Attack",
                            "description": "Attackers spoofed a company's email domain to send fake invoices."
                        }
                    }
                },
                {
                    "title": "Safe Browsing",
                    "module_order": 5,
                    "content_json": {
                        "description": "Protect yourself while browsing the internet and avoid online threats.",
                        "learning_objectives": [
                            "Identify secure websites",
                            "Protect against browser vulnerabilities",
                            "Manage browser extensions safely"
                        ],
                        "content": [
                            {
                                "type": "text",
                                "title": "Safe Browsing Practices",
                                "body": "Look for HTTPS in the URL, avoid suspicious websites, keep your browser updated."
                            }
                        ],
                        "real_world_example": {
                            "title": "The 2022 Malvertising Campaign",
                            "description": "A major ad network was compromised, delivering malware through legitimate websites."
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
                {"module_id": 1, "question": "Which of the following is an example of a strong password?", 
                 "options_json": ["password123", "B3stP@ssw0rd!", "12345678", "qwerty"], 
                 "correct_answer": "B3stP@ssw0rd!", "difficulty": "beginner"},
                {"module_id": 2, "question": "What is phishing?", 
                 "options_json": ["An attack that tricks users into revealing sensitive information", "A type of computer virus", "A hardware failure", "A network configuration error"], 
                 "correct_answer": "An attack that tricks users into revealing sensitive information", "difficulty": "beginner"},
                {"module_id": 2, "question": "Which of the following is a red flag for a phishing email?", 
                 "options_json": ["Spelling and grammar errors", "Your name in the greeting", "A signature with contact information", "Professional formatting"], 
                 "correct_answer": "Spelling and grammar errors", "difficulty": "beginner"},
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
                        "description": "You receive an email from a service claiming your password has expired. The email includes a link to a website that looks legitimate."
                    },
                    "options_json": [
                        "Click the link and reset your password",
                        "Ignore the email",
                        "Go directly to the service's website and reset your password there",
                        "Forward the email to your friends"
                    ],
                    "correct_answer": "Go directly to the service's website and reset your password there",
                    "explanation": "This is a phishing attempt. Always navigate to the service's official website directly."
                },
                {
                    "module_id": 2,
                    "scenario_content": {
                        "title": "Urgent Email from CEO",
                        "description": "You receive an email from your CEO asking you to send sensitive payroll data immediately."
                    },
                    "options_json": [
                        "Send the data immediately as requested",
                        "Reply asking for a document request form",
                        "Verify the request through a different channel like a phone call",
                        "Forward the email to all employees"
                    ],
                    "correct_answer": "Verify the request through a different channel like a phone call",
                    "explanation": "This is likely a CEO fraud or spear phishing attempt. Always verify sensitive data requests through official channels."
                },
                {
                    "module_id": 3,
                    "scenario_content": {
                        "title": "MFA Setup Assistant",
                        "description": "You receive a call from someone claiming to be from IT support asking for your authentication code."
                    },
                    "options_json": [
                        "Provide your phone number and the code",
                        "Hang up and contact IT support through the official number",
                        "Ask them to verify their identity first",
                        "Provide only your phone number"
                    ],
                    "correct_answer": "Hang up and contact IT support through the official number",
                    "explanation": "This is a social engineering attack. Never share authentication codes over the phone."
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

@app.route('/api/test')
def test():
    return jsonify({'status': 'ok', 'message': 'API is working'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
