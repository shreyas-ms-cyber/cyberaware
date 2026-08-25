from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models import Scenario
import traceback

bp = Blueprint('scenarios', __name__, url_prefix='/api')

@bp.route('/scenarios', methods=['GET'])
def get_all_scenarios():
    """Get all scenarios with pagination"""
    try:
        limit = request.args.get('limit', default=20, type=int)
        offset = request.args.get('offset', default=0, type=int)
        
        if limit > 100:
            limit = 100
        
        scenarios = Scenario.query.order_by(Scenario.id).offset(offset).limit(limit).all()
        total = Scenario.query.count()
        
        return jsonify({
            'success': True,
            'data': [s.to_dict() for s in scenarios],
            'count': len(scenarios),
            'total': total,
            'limit': limit,
            'offset': offset
        })
    except Exception as e:
        print(f"Error in get_all_scenarios: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': {'message': 'Failed to fetch scenarios', 'code': 'SCENARIOS_FETCH_ERROR'}
        }), 500

@bp.route('/scenarios/<int:module_id>', methods=['GET'])
def get_scenarios_by_module(module_id):
    """Get scenarios for a specific module"""
    try:
        scenarios = Scenario.query.filter_by(module_id=module_id).all()
        
        return jsonify({
            'success': True,
            'data': [s.to_dict() for s in scenarios],
            'count': len(scenarios)
        })
    except Exception as e:
        print(f"Error in get_scenarios_by_module: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': {'message': 'Failed to fetch scenarios', 'code': 'SCENARIOS_FETCH_ERROR'}
        }), 500

@bp.route('/scenarios/<int:scenario_id>/evaluate', methods=['POST'])
def evaluate_scenario(scenario_id):
    """Evaluate a scenario answer"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': {'message': 'No data provided', 'code': 'INVALID_REQUEST'}
            }), 400
        
        user_answer = data.get('answer')
        
        if not user_answer:
            return jsonify({
                'success': False,
                'error': {'message': 'Answer is required', 'code': 'MISSING_FIELD'}
            }), 400
        
        scenario = Scenario.query.get(scenario_id)
        
        if not scenario:
            return jsonify({
                'success': False,
                'error': {'message': f'Scenario {scenario_id} not found', 'code': 'SCENARIO_NOT_FOUND'}
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
        print(f"Error in evaluate_scenario: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': {'message': 'Failed to evaluate scenario', 'code': 'SCENARIO_EVALUATE_ERROR'}
        }), 500
