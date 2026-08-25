from flask import Blueprint, jsonify

bp = Blueprint('health', __name__, url_prefix='/api')

@bp.route('/health', methods=['GET'])
def health():
    return jsonify({
        'success': True,
        'data': {
            'status': 'healthy',
            'service': 'CyberAware API',
            'version': '1.0.0'
        }
    })
