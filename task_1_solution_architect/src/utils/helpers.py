import logging
import os
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
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise Exception("OPENAI_API_KEY environment variable is not set")
    return api_key

def clean_unicode(text):
    """
    Clean and sanitize Unicode characters in text - centralized utility
    """
    if not isinstance(text, str):
        return text
    
    # Use a pre-compiled mapping for better performance
    replacements = {
        '\u2019': "'",  # Right single quotation mark
        '\u2018': "'",  # Left single quotation mark
        '\u201c': '"',  # Left double quotation mark
        '\u201d': '"',  # Right double quotation mark
        '\u2013': '-',  # En dash
        '\u2014': '-',  # Em dash
        '\u2026': '...',  # Horizontal ellipsis
        '\u00a0': ' ',  # Non-breaking space
    }
    
    # Use str.translate for better performance than multiple replace calls
    translation_table = str.maketrans(replacements)
    return text.translate(translation_table)

def clean_unicode_list(items):
    """
    Clean Unicode characters in a list of strings
    """
    if not isinstance(items, list):
        return items
    return [clean_unicode(item) for item in items if isinstance(item, str)]
