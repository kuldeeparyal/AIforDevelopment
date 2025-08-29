from flask import Blueprint, request, jsonify
import logging

from src.services.interactive_service import InteractiveQuestioningService
from src.utils.validators import RequestValidator
from src.utils.helpers import (
    create_error_response,
    create_success_response,
    log_request_info,
    validate_openai_key,
)

questioning_bp = Blueprint('questioning', __name__)
logger = logging.getLogger(__name__)

@questioning_bp.route('/analyze/interactive', methods=['POST'])
def start_interactive_analysis():
    """
    Start an interactive questioning session for enhanced analysis
    """
    try:
        validate_openai_key()
        
        data = request.get_json()
        if not data or 'problem_statement' not in data:
            return create_error_response("Missing required field: problem_statement")
        
        # Check for required enhanced analysis fields
        if 'organization_name' not in data:
            return create_error_response("Missing required field: organization_name")
        if 'geographic_location' not in data:
            return create_error_response("Missing required field: geographic_location")
        
        # Check if structured problem statement is provided
        structured_problem = data.get('structured_problem_statement')
        if structured_problem:
            # Validate structured problem statement fields
            required_fields = ['we_are', 'we_are_trying_to', 'but', 'because', 'which_makes_us_feel']
            missing_fields = [field for field in required_fields if not structured_problem.get(field)]
            if missing_fields:
                return create_error_response(f"Missing structured problem statement fields: {', '.join(missing_fields)}")
        
        log_request_info('/analyze/interactive', data)
        
        problem_statement = RequestValidator.sanitize_input(data['problem_statement'])
        organization_name = RequestValidator.sanitize_input(data['organization_name'])
        geographic_location = RequestValidator.sanitize_input(data['geographic_location'])
        
        # Process structured problem statement if provided
        if structured_problem:
            structured_statement = {
                'we_are': RequestValidator.sanitize_input(structured_problem['we_are']),
                'we_are_trying_to': RequestValidator.sanitize_input(structured_problem['we_are_trying_to']),
                'but': RequestValidator.sanitize_input(structured_problem['but']),
                'because': RequestValidator.sanitize_input(structured_problem['because']),
                'which_makes_us_feel': RequestValidator.sanitize_input(structured_problem['which_makes_us_feel'])
            }
        else:
            structured_statement = None
        
        # Start interactive questioning session with organization context
        result = InteractiveQuestioningService.start_questioning(
            problem_statement, organization_name, geographic_location, structured_statement
        )
        
        logger.info(f"Interactive questioning started: {result['problem_id']}")
        return create_success_response(result)
        
    except Exception as e:
        logger.error(f"Interactive analysis start error: {e}")
        return create_error_response(
            f"Failed to start interactive analysis: {str(e)}",
            status_code=500,
            error_type="interactive_analysis_error"
        )

@questioning_bp.route('/analyze/interactive/continue', methods=['POST'])
def continue_interactive_analysis():
    """
    Continue the interactive questioning session with user's answer
    """
    try:
        validate_openai_key()
        
        data = request.get_json()
        if not data or 'problem_id' not in data or 'answer' not in data:
            return create_error_response("Missing required fields: problem_id, answer")
        
        log_request_info('/analyze/interactive/continue', data)
        
        problem_id = RequestValidator.sanitize_input(data['problem_id'])
        answer = RequestValidator.sanitize_input(data['answer'])
        
        # Continue questioning
        result = InteractiveQuestioningService.continue_questioning(problem_id, answer)
        
        logger.info(f"Interactive questioning continued: {problem_id}")
        return create_success_response(result)
        
    except Exception as e:
        logger.error(f"Interactive questioning continue error: {e}")
        return create_error_response(
            f"Failed to continue questioning: {str(e)}",
            status_code=500,
            error_type="interactive_questioning_error"
        )

@questioning_bp.route('/analyze/interactive/complete', methods=['POST'])
def complete_interactive_analysis():
    """
    Complete the interactive analysis and generate comprehensive recommendations
    """
    try:
        validate_openai_key()
        
        data = request.get_json()
        if not data or 'problem_id' not in data:
            return create_error_response("Missing required field: problem_id")
        
        log_request_info('/analyze/interactive/complete', data)
        
        problem_id = RequestValidator.sanitize_input(data['problem_id'])
        
        # Generate final comprehensive analysis and recommendations
        result = InteractiveQuestioningService.generate_comprehensive_solution(problem_id)
        
        logger.info(f"Interactive analysis completed: {problem_id}")
        return create_success_response(result)
        
    except Exception as e:
        logger.error(f"Interactive analysis completion error: {e}")
        return create_error_response(
            f"Failed to complete interactive analysis: {str(e)}",
            status_code=500,
            error_type="interactive_completion_error"
        )