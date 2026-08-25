from flask import Blueprint, jsonify, request
from app.extensions import db, limiter
from app.services.ai_service import AIService

bp = Blueprint('quiz_generate', __name__, url_prefix='/api')
ai_service = AIService()

@bp.route('/quiz/generate', methods=['POST'])
@limiter.limit("5 per minute")
def generate_quiz():
    """Generate AI-powered quiz"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'No data provided',
                    'code': 'INVALID_REQUEST'
                }
            }), 400
        
        topic = data.get('topic', '').strip()
        difficulty = data.get('difficulty', 'intermediate')
        question_count = data.get('question_count', 5)
        
        # Validate topic
        if not topic:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Topic is required',
                    'code': 'MISSING_TOPIC'
                }
            }), 400
        
        # Validate difficulty
        valid_difficulties = ['beginner', 'intermediate', 'advanced']
        if difficulty not in valid_difficulties:
            return jsonify({
                'success': False,
                'error': {
                    'message': f'Difficulty must be one of: {", ".join(valid_difficulties)}',
                    'code': 'INVALID_DIFFICULTY'
                }
            }), 400
        
        # Validate question count
        if question_count < 1 or question_count > 10:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Question count must be between 1 and 10',
                    'code': 'INVALID_QUESTION_COUNT'
                }
            }), 400
        
        # Generate quiz
        result = ai_service.generate_quiz(topic, difficulty, question_count)
        
        if result.get('success'):
            return jsonify({
                'success': True,
                'data': {
                    'topic': topic,
                    'difficulty': difficulty,
                    'questions': result['data'],
                    'count': len(result['data'])
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': {
                    'message': result.get('error', 'Failed to generate quiz'),
                    'code': 'GENERATION_ERROR'
                }
            }), 503
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'message': 'Failed to generate quiz',
                'code': 'QUIZ_GENERATE_ERROR'
            }
        }), 500
