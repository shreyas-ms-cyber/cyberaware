from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models import Scenario

bp = Blueprint('scenarios', __name__, url_prefix='/api')

@bp.route('/scenarios/<int:module_id>', methods=['GET'])
def get_scenarios(module_id):
    """Get all scenarios for a specific module"""
    try:
        scenarios = Scenario.query.filter_by(module_id=module_id).all()
        
        if not scenarios:
            return jsonify({
                'success': True,
                'data': [],
                'message': 'No scenarios found for this module',
                'count': 0
            })
        
        return jsonify({
            'success': True,
            'data': [s.to_dict() for s in scenarios],
            'count': len(scenarios)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'message': 'Failed to fetch scenarios',
                'code': 'SCENARIO_FETCH_ERROR'
            }
        }), 500

@bp.route('/scenarios/<int:scenario_id>/evaluate', methods=['POST'])
def evaluate_scenario(scenario_id):
    """Evaluate a scenario answer"""
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
        
        user_answer = data.get('answer')
        
        if not user_answer:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Answer is required',
                    'code': 'MISSING_FIELD'
                }
            }), 400
        
        # Get the scenario
        scenario = Scenario.query.get(scenario_id)
        
        if not scenario:
            return jsonify({
                'success': False,
                'error': {
                    'message': f'Scenario with ID {scenario_id} not found',
                    'code': 'SCENARIO_NOT_FOUND'
                }
            }), 404
        
        is_correct = user_answer == scenario.correct_answer
        
        return jsonify({
            'success': True,
            'data': {
                'scenario_id': scenario_id,
                'is_correct': is_correct,
                'correct_answer': scenario.correct_answer,
                'explanation': scenario.explanation
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'message': 'Failed to evaluate scenario',
                'code': 'SCENARIO_EVALUATE_ERROR'
            }
        }), 500
