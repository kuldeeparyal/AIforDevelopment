import logging
from flask import jsonify

logger = logging.getLogger(__name__)

def create_error_response(message, status_code=400, error_type="validation_error"):
    """
    Create standardized error response
    """
    return jsonify({
        "error": error_type,
        "message": message,
        "status_code": status_code
    }), status_code

def create_success_response(data, status_code=200):
    """
    Create standardized success response
    """
    response_data = {
        "success": True,
        **data
    }
    return jsonify(response_data), status_code

def log_request_info(endpoint, data):
    """
    Log request information for debugging
    """
    logger.info(f"Request to {endpoint}: {type(data).__name__} with keys: {list(data.keys()) if isinstance(data, dict) else 'N/A'}")

def validate_openai_key():
    """
    Validate that OpenAI API key is available
    """
    import os
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise Exception("OPENAI_API_KEY environment variable is not set")
    return api_key
