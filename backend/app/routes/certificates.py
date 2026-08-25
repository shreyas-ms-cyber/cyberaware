from flask import Blueprint, jsonify, request
from app.extensions import db, limiter
from app.models import Certificate
import re

bp = Blueprint('certificates', __name__, url_prefix='/api')

@bp.route('/certificate', methods=['POST'])
@limiter.limit("5 per hour")
def create_certificate():
    """Create a new certificate"""
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
        
        name = data.get('name', '').strip()
        score = data.get('score')
        
        # Validate name
        if not name:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Name is required',
                    'code': 'MISSING_NAME'
                }
            }), 400
        
        if len(name) < 2:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Name must be at least 2 characters',
                    'code': 'INVALID_NAME'
                }
            }), 400
        
        if len(name) > 100:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Name must be less than 100 characters',
                    'code': 'INVALID_NAME'
                }
            }), 400
        
        # Validate name contains only safe characters
        if not re.match(r'^[a-zA-Z\s\-\.\']+$', name):
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Name contains invalid characters',
                    'code': 'INVALID_NAME'
                }
            }), 400
        
        # Validate score
        if score is None:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Score is required',
                    'code': 'MISSING_SCORE'
                }
            }), 400
        
        if not isinstance(score, (int, float)):
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Score must be a number',
                    'code': 'INVALID_SCORE'
                }
            }), 400
        
        if score < 0 or score > 100:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Score must be between 0 and 100',
                    'code': 'INVALID_SCORE'
                }
            }), 400
        
        # Create certificate
        certificate = Certificate(name=name, score=int(score))
        db.session.add(certificate)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': certificate.to_dict(),
            'message': 'Certificate created successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': {
                'message': 'Failed to create certificate',
                'code': 'CERTIFICATE_CREATE_ERROR'
            }
        }), 500

@bp.route('/certificate/<certificate_id>', methods=['GET'])
def get_certificate(certificate_id):
    """Get certificate by ID"""
    try:
        certificate = Certificate.query.filter_by(certificate_id=certificate_id).first()
        
        if not certificate:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Certificate not found',
                    'code': 'CERTIFICATE_NOT_FOUND'
                }
            }), 404
        
        return jsonify({
            'success': True,
            'data': certificate.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'message': 'Failed to fetch certificate',
                'code': 'CERTIFICATE_FETCH_ERROR'
            }
        }), 500
