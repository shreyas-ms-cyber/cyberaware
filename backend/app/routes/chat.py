from flask import Blueprint, jsonify, request
from app.extensions import db, limiter
from app.models import ChatAnalytics
from app.services.ai_service import AIService
import re

bp = Blueprint('chat', __name__, url_prefix='/api')
ai_service = AIService()

@bp.route('/chat', methods=['POST'])
@limiter.limit("10 per minute")
def chat():
    """CyberBuddy AI chat endpoint"""
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
        
        message = data.get('message', '').strip()
        module_context = data.get('module', 'general')
        conversation_history = data.get('history', [])
        
        if not message:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Message is required',
                    'code': 'MISSING_MESSAGE'
                }
            }), 400
        
        # Sanitize message
        message = re.sub(r'<[^>]*>', '', message)  # Remove HTML tags
        message = message[:500]  # Limit length
        
        # Log chat analytics
        analytics = ChatAnalytics(
            module_context=module_context,
            message_count=1
        )
        db.session.add(analytics)
        db.session.commit()
        
        # Generate AI response
        response = ai_service.generate_chat_response(
            message=message,
            module_context=module_context,
            conversation_history=conversation_history
        )
        
        if response.get('success'):
            return jsonify({
                'success': True,
                'data': {
                    'message': response['response'],
                    'context': module_context
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': {
                    'message': response.get('error', 'AI service unavailable'),
                    'code': 'AI_ERROR'
                }
            }), 503
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'message': 'Failed to process chat message',
                'code': 'CHAT_ERROR'
            }
        }), 500
