from flask import Blueprint, request, jsonify
import logging
from services.analysis_service import AnalysisService
from utils.validators import RequestValidator
from utils.helpers import create_error_response, create_success_response, log_request_info, validate_openai_key

recommend_bp = Blueprint('recommend', __name__)
logger = logging.getLogger(__name__)

@recommend_bp.route('/recommend', methods=['POST'])
def generate_recommendations():
    """
    Generate technical recommendations based on problem analysis
    Supports both basic and enhanced recommendation modes
    """
    try:
        # Validate OpenAI API key
        validate_openai_key()
        
        # Validate request
        is_valid, error_message = RequestValidator.validate_recommend_request()
        if not is_valid:
            return create_error_response(error_message)
        
        # Get request data
        data = request.get_json()
        log_request_info('/recommend', data)
        
        # Sanitize input
        problem_id = RequestValidator.sanitize_input(data['problem_id'])
        description = RequestValidator.sanitize_input(data['description'])
        clarifying_questions = [
            RequestValidator.sanitize_input(q) for q in data['clarifying_questions']
        ]
        
        # Generate recommendations (always basic mode for /recommend endpoint)
        result = AnalysisService.generate_recommendation(
            problem_id=problem_id,
            description=description,
            clarifying_questions=clarifying_questions,
            analysis_mode='basic'
        )
        
        # Return only specified fields for simple analysis
        simple_result = {
            'solution_summary': result['solution_summary'],
            'recommended_tech_stack': result['recommended_tech_stack'],
            'initial_steps': result['initial_steps']
        }
        
        logger.info(f"Recommendations generated successfully: {problem_id}")
        
        return create_success_response(simple_result)
        
    except Exception as e:
        logger.error(f"Recommend endpoint error: {e}")
        if "not found" in str(e).lower():
            return create_error_response(
                str(e),
                status_code=404,
                error_type="not_found"
            )
        elif "API key" in str(e).lower():
            return create_error_response(
                "OpenAI API configuration error. Please check your API key.",
                status_code=500,
                error_type="configuration_error"
            )
        else:
            return create_error_response(
                f"Recommendation generation failed: {str(e)}",
                status_code=500,
                error_type="recommendation_error"
            )

@recommend_bp.route('/recommend/modes', methods=['GET'])
def get_recommendation_modes():
    """
    Get available recommendation modes and their descriptions
    """
    return create_success_response({
        "modes": {
            "basic": {
                "name": "Basic Recommendations",
                "description": "Practical technology recommendations with proven, cost-effective solutions",
                "features": [
                    "Direct problem addressing",
                    "Cost-effective solutions",
                    "Quick implementation focus",
                    "Proven nonprofit technology stacks"
                ]
            },
            "enhanced": {
                "name": "Enhanced Recommendations",
                "description": "Comprehensive technology strategy with multi-layered implementation approach",
                "features": [
                    "Multi-phase implementation strategy",
                    "Integration planning",
                    "Change management considerations",
                    "ROI measurement planning",
                    "Security and compliance guidance",
                    "Long-term sustainability planning"
                ]
            }
        }
    })
