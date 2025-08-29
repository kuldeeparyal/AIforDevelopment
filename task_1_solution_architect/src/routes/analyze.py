from flask import Blueprint, request, jsonify
import logging
from src.services.analysis_service import AnalysisService
from src.utils.validators import RequestValidator
from src.utils.helpers import (
    create_error_response,
    create_success_response,
    log_request_info,
    validate_openai_key,
)

analyze_bp = Blueprint('analyze', __name__)
logger = logging.getLogger(__name__)

@analyze_bp.route('/analyze', methods=['POST'])
def analyze_problem():
    """
    Analyze nonprofit problem statements
    Supports both basic and enhanced analysis modes
    """
    try:
        # Validate OpenAI API key
        validate_openai_key()
        
        # Validate request
        is_valid, error_message = RequestValidator.validate_analyze_request()
        if not is_valid:
            return create_error_response(error_message)
        
        # Get request data
        data = request.get_json()
        log_request_info('/analyze', data)
        
        # Sanitize input
        problem_statement = RequestValidator.sanitize_input(data['problem_statement'])
        
        # Perform analysis (always basic mode for /analyze endpoint)
        result = AnalysisService.analyze_problem(
            problem_statement=problem_statement,
            analysis_mode='basic'
        )
        
        # Return only specified fields for simple analysis
        simple_result = {
            'problem_id': result['problem_id'],
            'description': result['description'],
            'clarifying_questions': result['clarifying_questions']
        }
        
        logger.info(f"Analysis completed successfully: {result['problem_id']}")
        
        return create_success_response(simple_result)
        
    except Exception as e:
        logger.error(f"Analysis endpoint error: {e}")
        if "API key" in str(e).lower():
            return create_error_response(
                "OpenAI API configuration error. Please check your API key.",
                status_code=500,
                error_type="configuration_error"
            )
        else:
            return create_error_response(
                f"Analysis failed: {str(e)}",
                status_code=500,
                error_type="analysis_error"
            )

@analyze_bp.route('/analyze/modes', methods=['GET'])
def get_analysis_modes():
    """
    Get available analysis modes and their descriptions
    """
    return create_success_response({
        "modes": {
            "basic": {
                "name": "Basic Analysis",
                "description": "Quick analysis focusing on core operational challenges and essential technical gaps",
                "features": [
                    "Concise problem identification",
                    "Essential clarifying questions",
                    "Fast processing time"
                ]
            },
            "enhanced": {
                "name": "Enhanced Analysis", 
                "description": "Comprehensive analysis considering nonprofit-specific constraints and strategic factors",
                "features": [
                    "Root cause analysis",
                    "Organizational impact assessment",
                    "Strategic clarifying questions",
                    "Resource constraint evaluation",
                    "Change management considerations"
                ]
            }
        }
    })
