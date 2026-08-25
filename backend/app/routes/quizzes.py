from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models import QuizQuestion

bp = Blueprint('quizzes', __name__, url_prefix='/api')

@bp.route('/quizzes/<int:module_id>', methods=['GET'])
def get_quiz_questions(module_id):
    """Get all quiz questions for a specific module"""
    try:
        questions = QuizQuestion.query.filter_by(module_id=module_id).all()
        
        if not questions:
            return jsonify({
                'success': True,
                'data': [],
                'message': 'No quiz questions found for this module',
                'count': 0
            })
        
        return jsonify({
            'success': True,
            'data': [q.to_dict() for q in questions],
            'count': len(questions)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'message': 'Failed to fetch quiz questions',
                'code': 'QUIZ_FETCH_ERROR'
            }
        }), 500

@bp.route('/quiz/submit', methods=['POST'])
def submit_quiz():
    """Submit quiz answers and get results"""
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
        
        module_id = data.get('module_id')
        answers = data.get('answers', {})
        
        if not module_id:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'module_id is required',
                    'code': 'MISSING_FIELD'
                }
            }), 400
        
        # Fetch questions for this module
        questions = QuizQuestion.query.filter_by(module_id=module_id).all()
        
        if not questions:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'No questions found for this module',
                    'code': 'QUESTIONS_NOT_FOUND'
                }
            }), 404
        
        # Evaluate answers
        results = []
        correct_count = 0
        
        for question in questions:
            user_answer = answers.get(str(question.id))
            is_correct = user_answer == question.correct_answer
            
            if is_correct:
                correct_count += 1
                
            results.append({
                'question_id': question.id,
                'question': question.question,
                'correct_answer': question.correct_answer,
                'user_answer': user_answer,
                'is_correct': is_correct
            })
        
        total_questions = len(questions)
        score = round((correct_count / total_questions) * 100) if total_questions > 0 else 0
        
        return jsonify({
            'success': True,
            'data': {
                'module_id': module_id,
                'score': score,
                'correct_count': correct_count,
                'total_questions': total_questions,
                'results': results
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'message': 'Failed to submit quiz',
                'code': 'QUIZ_SUBMIT_ERROR'
            }
        }), 500
