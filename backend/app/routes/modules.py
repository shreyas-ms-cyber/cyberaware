from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models import TrainingModule

bp = Blueprint('modules', __name__, url_prefix='/api')

@bp.route('/modules', methods=['GET'])
def get_modules():
    """Get all training modules"""
    try:
        modules = TrainingModule.query.order_by(TrainingModule.module_order).all()
        
        if not modules:
            return jsonify({
                'success': True,
                'data': [],
                'message': 'No modules found'
            })
        
        return jsonify({
            'success': True,
            'data': [module.to_dict() for module in modules],
            'count': len(modules)
        })
    except Exception as e:
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
        
        # Get additional data
        module_data = module.to_dict()
        module_data['quiz_count'] = len(module.quiz_questions)
        module_data['scenario_count'] = len(module.scenarios)
        
        return jsonify({
            'success': True,
            'data': module_data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'message': 'Failed to fetch module',
                'code': 'MODULE_FETCH_ERROR'
            }
        }), 500
