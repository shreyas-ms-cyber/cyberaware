import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.extensions import db, limiter

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app, origins=app.config.get('CORS_ORIGIN', '*'))
    db.init_app(app)
    limiter.init_app(app)
    
    # Import and register all routes
    try:
        from app.routes import health, modules, quizzes, scenarios, certificates, chat, quiz_generate
        app.register_blueprint(health.bp)
        app.register_blueprint(modules.bp)
        app.register_blueprint(quizzes.bp)
        app.register_blueprint(scenarios.bp)
        app.register_blueprint(certificates.bp)
        app.register_blueprint(chat.bp)
        app.register_blueprint(quiz_generate.bp)
    except ImportError as e:
        print(f"Warning: Could not import routes: {e}")
    
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
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            'success': False,
            'error': {
                'message': 'Method not allowed',
                'code': 'METHOD_NOT_ALLOWED'
            }
        }), 405
    
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

# Create app instance
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
