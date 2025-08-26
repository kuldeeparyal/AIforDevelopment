from flask import request
import json
import logging

logger = logging.getLogger(__name__)

class RequestValidator:
    @staticmethod
    def validate_analyze_request():
        """
        Validate /analyze endpoint request
        """
        try:
            if not request.is_json:
                return False, "Request must be JSON"
            
            data = request.get_json()
            
            if not data:
                return False, "Request body cannot be empty"
            
            if 'problem_statement' not in data:
                return False, "Missing required field: problem_statement"
            
            problem_statement = data['problem_statement']
            
            if not isinstance(problem_statement, str):
                return False, "problem_statement must be a string"
            
            if not problem_statement.strip():
                return False, "problem_statement cannot be empty"
            
            if len(problem_statement.strip()) < 10:
                return False, "problem_statement must be at least 10 characters long"
            
            if len(problem_statement) > 5000:
                return False, "problem_statement must be less than 5000 characters"
            
            # Validate analysis_mode if provided
            analysis_mode = data.get('analysis_mode', 'basic')
            if analysis_mode not in ['basic', 'enhanced']:
                return False, "analysis_mode must be either 'basic' or 'enhanced'"
            
            return True, None
            
        except Exception as e:
            logger.error(f"Validation error: {e}")
            return False, "Invalid request format"

    @staticmethod
    def validate_recommend_request():
        """
        Validate /recommend endpoint request
        """
        try:
            if not request.is_json:
                return False, "Request must be JSON"
            
            data = request.get_json()
            
            if not data:
                return False, "Request body cannot be empty"
            
            # Required fields
            required_fields = ['problem_id', 'description', 'clarifying_questions']
            
            for field in required_fields:
                if field not in data:
                    return False, f"Missing required field: {field}"
            
            # Validate types
            if not isinstance(data['problem_id'], str):
                return False, "problem_id must be a string"
            
            if not isinstance(data['description'], str):
                return False, "description must be a string"
            
            if not isinstance(data['clarifying_questions'], list):
                return False, "clarifying_questions must be an array"
            
            # Validate values
            if not data['problem_id'].strip():
                return False, "problem_id cannot be empty"
            
            if not data['description'].strip():
                return False, "description cannot be empty"
            
            # Validate clarifying_questions array
            for i, question in enumerate(data['clarifying_questions']):
                if not isinstance(question, str):
                    return False, f"clarifying_questions[{i}] must be a string"
            
            # Validate analysis_mode if provided
            analysis_mode = data.get('analysis_mode', 'basic')
            if analysis_mode not in ['basic', 'enhanced']:
                return False, "analysis_mode must be either 'basic' or 'enhanced'"
            
            return True, None
            
        except Exception as e:
            logger.error(f"Validation error: {e}")
            return False, "Invalid request format"

    @staticmethod
    def sanitize_input(text):
        """
        Basic input sanitization for text fields
        """
        if not isinstance(text, str):
            return text
        
        # Remove potentially dangerous characters and normalize whitespace
        sanitized = text.strip()
        sanitized = ' '.join(sanitized.split())  # Normalize whitespace
        
        return sanitized
