from flask import Blueprint, request, jsonify
import logging
from src.services.problem_structuring_service import ProblemStructuringService
from src.utils.validators import RequestValidator
from src.utils.helpers import (
    create_error_response,
    create_success_response,
    log_request_info,
    validate_openai_key,
)


structuring_bp = Blueprint('structuring', __name__)
logger = logging.getLogger(__name__)

@structuring_bp.route('/problem/structure/start', methods=['POST'])
def start_problem_structuring():
    """
    Start guided problem statement structuring for nonprofits
    """
    try:
        validate_openai_key()
        
        data = request.get_json()
        if not data or 'initial_challenge' not in data:
            return create_error_response("Missing required field: initial_challenge")
        
        log_request_info('/problem/structure/start', data)
        
        initial_challenge = RequestValidator.sanitize_input(data['initial_challenge'])
        
        # Start structured problem development
        result = ProblemStructuringService.start_structuring(initial_challenge)
        
        logger.info(f"Problem structuring started: {result['structuring_id']}")
        return create_success_response(result)
        
    except Exception as e:
        logger.error(f"Problem structuring start error: {e}")
        return create_error_response(
            f"Failed to start problem structuring: {str(e)}",
            status_code=500,
            error_type="structuring_start_error"
        )

@structuring_bp.route('/problem/structure/continue', methods=['POST'])
def continue_problem_structuring():
    """
    Continue the structured problem statement development
    """
    try:
        validate_openai_key()
        
        data = request.get_json()
        if not data or 'structuring_id' not in data or 'response' not in data:
            return create_error_response("Missing required fields: structuring_id, response")
        
        log_request_info('/problem/structure/continue', data)
        
        structuring_id = RequestValidator.sanitize_input(data['structuring_id'])
        response = RequestValidator.sanitize_input(data['response'])
        
        # Continue structuring
        result = ProblemStructuringService.continue_structuring(structuring_id, response)
        
        logger.info(f"Problem structuring continued: {structuring_id}")
        return create_success_response(result)
        
    except Exception as e:
        logger.error(f"Problem structuring continue error: {e}")
        return create_error_response(
            f"Failed to continue structuring: {str(e)}",
            status_code=500,
            error_type="structuring_continue_error"
        )

@structuring_bp.route('/problem/structure/complete', methods=['POST'])
def complete_problem_structuring():
    """
    Complete problem structuring and generate well-formed problem statement
    """
    try:
        validate_openai_key()
        
        data = request.get_json()
        if not data or 'structuring_id' not in data:
            return create_error_response("Missing required field: structuring_id")
        
        log_request_info('/problem/structure/complete', data)
        
        structuring_id = RequestValidator.sanitize_input(data['structuring_id'])
        
        # Generate final structured problem statement
        result = ProblemStructuringService.complete_structuring(structuring_id)
        
        logger.info(f"Problem structuring completed: {structuring_id}")
        return create_success_response(result)
        
    except Exception as e:
        logger.error(f"Problem structuring completion error: {e}")
        return create_error_response(
            f"Failed to complete structuring: {str(e)}",
            status_code=500,
            error_type="structuring_completion_error"
        )