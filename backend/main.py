import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.extensions import db, limiter

print(f"Python version: {sys.version}")
print(f"Starting CyberAware Backend...")

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    print(f"Database URL: {app.config.get('SQLALCHEMY_DATABASE_URI', 'Not set')}")
    
    # Initialize CORS with explicit origins
    cors_origin = app.config.get('CORS_ORIGIN', '*')
    CORS(app, origins=cors_origin, supports_credentials=True)
    print(f"CORS configured for: {cors_origin}")
    
    # Initialize database
    try:
        db.init_app(app)
        with app.app_context():
            db.create_all()
            print("✅ Database initialized successfully")
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

@app.route('/api/test')
def test():
    return jsonify({'status': 'ok', 'message': 'API is working'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
