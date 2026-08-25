from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models import TrainingModule
import traceback

bp = Blueprint('modules', __name__, url_prefix='/api')

@bp.route('/modules', methods=['GET'])
def get_modules():
    """Get all training modules - optimized for large datasets"""
    try:
        # Get pagination parameters
        limit = request.args.get('limit', default=100, type=int)
        offset = request.args.get('offset', default=0, type=int)
        
        # Cap limit to prevent memory issues
        if limit > 200:
            limit = 200
        
        # Query with optimization - only load necessary fields
        modules = TrainingModule.query.order_by(
            TrainingModule.module_order
        ).offset(offset).limit(limit).all()
        
        # Count total
        total = TrainingModule.query.count()
        
        # Build response with only necessary fields
        module_list = []
        for module in modules:
            module_list.append({
                'id': module.id,
                'title': module.title,
                'module_order': module.module_order,
                'content': module.content_json,
                'quiz_count': len(module.quiz_questions) if hasattr(module, 'quiz_questions') else 0,
                'scenario_count': len(module.scenarios) if hasattr(module, 'scenarios') else 0
            })
        
        return jsonify({
            'success': True,
            'data': module_list,
            'count': len(module_list),
            'total': total,
            'limit': limit,
            'offset': offset
        })
    except Exception as e:
        print(f"Error in get_modules: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': {
                'message': 'Failed to fetch modules',
                'code': 'MODULES_FETCH_ERROR'
            }
        }), 500

@bp.route('/modules/<int:module_id>', methods=['GET'])
def get_module(module_id):
    """Get a specific module by ID"""
    try:
        module = TrainingModule.query.get(module_id)
        if not module:
            return jsonify({
                'success': False,
                'error': {
                    'message': f'Module with ID {module_id} not found',
                    'code': 'MODULE_NOT_FOUND'
                }
            }), 404
        
        module_data = module.to_dict()
        module_data['quiz_count'] = len(module.quiz_questions) if hasattr(module, 'quiz_questions') else 0
        module_data['scenario_count'] = len(module.scenarios) if hasattr(module, 'scenarios') else 0
        
        return jsonify({
            'success': True,
            'data': module_data
        })
    except Exception as e:
        print(f"Error in get_module: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': {
                'message': 'Failed to fetch module',
                'code': 'MODULE_FETCH_ERROR'
            }
        }), 500
