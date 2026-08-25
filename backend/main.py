import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.extensions import db, limiter

print(f"Python version: {sys.version}")
print(f"Python executable: {sys.executable}")

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    print(f"Database URL: {app.config.get('SQLALCHEMY_DATABASE_URI', 'Not set')}")
    
    # Initialize extensions
    CORS(app, origins=app.config.get('CORS_ORIGIN', '*'))
    
    try:
        db.init_app(app)
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        # Continue without database for now
        pass
    
    limiter.init_app(app)
    
    # Import routes
    try:
        from app.routes import health, modules, quizzes, scenarios, certificates, chat, quiz_generate
        app.register_blueprint(health.bp)
        app.register_blueprint(modules.bp)
        app.register_blueprint(quizzes.bp)
        app.register_blueprint(scenarios.bp)
        app.register_blueprint(certificates.bp)
        app.register_blueprint(chat.bp)
        app.register_blueprint(quiz_generate.bp)
        print("✅ Routes registered successfully")
    except ImportError as e:
        print(f"⚠️ Warning: Could not import routes: {e}")
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': {
                'message': 'Resource not found',
                'code': 'NOT_FOUND'
            }
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'success': False,
            'error': {
                'message': 'Internal server error',
                'code': 'INTERNAL_ERROR'
            }
        }), 500
    
    return app

app = create_app()

@app.route('/')
def index():
    return jsonify({
        'service': 'CyberAware API',
        'version': '1.0.0',
        'status': 'running',
        'python_version': sys.version,
        'endpoints': {
            'health': '/api/health',
            'modules': '/api/modules',
            'module_detail': '/api/modules/<id>',
            'quizzes': '/api/quizzes/<module_id>',
            'quiz_submit': '/api/quiz/submit',
            'scenarios': '/api/scenarios/<module_id>',
            'scenario_evaluate': '/api/scenarios/<id>/evaluate',
            'certificate_create': '/api/certificate',
            'certificate_verify': '/api/certificate/<id>',
            'chat': '/api/chat',
            'quiz_generate': '/api/quiz/generate'
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
