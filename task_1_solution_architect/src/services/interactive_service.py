import uuid
import json
import logging
import re
from functools import lru_cache
from services.openai_service import OpenAIService

logger = logging.getLogger(__name__)

class InteractiveQuestioningService:
    # Store questioning sessions in memory (in production, use database)
    questioning_sessions = {}
    
    @staticmethod
    @lru_cache(maxsize=128)  # Cache abbreviations for performance
    def generate_organization_abbreviation(organization_name):
        """
        Generate a 3-4 character abbreviation from organization name
        """
        if not organization_name:
            return ""
        
        # Common words to skip when creating abbreviations (as frozenset for O(1) lookup)
        skip_words = frozenset({'the', 'and', 'of', 'for', 'in', 'on', 'at', 'to', 'a', 'an'})
        
        # Clean and split the organization name
        clean_name = re.sub(r'[^\w\s]', ' ', organization_name.lower())
        words = [word.strip() for word in clean_name.split() if word.strip() and word not in skip_words]
        
        if not words:
            # Fallback: use first 3 chars of original name
            return organization_name[:3].upper()
        
        # Take first letter of each significant word, max 4 characters
        abbreviation = ''.join(word[0] for word in words[:4])
        return abbreviation.upper()
    
    @classmethod
    def start_questioning(cls, problem_statement, organization_name=None, geographic_location=None, structured_statement=None):
        """
        Start an interactive questioning session for enhanced analysis
        """
        try:
            # Generate unique problem ID with organization abbreviation
            org_abbrev = cls.generate_organization_abbreviation(organization_name) if organization_name else ""
            unique_suffix = str(uuid.uuid4().hex[:6]).upper()
            
            if org_abbrev:
                problem_id = f"I{org_abbrev}{unique_suffix}"
            else:
                problem_id = f"I{unique_suffix}"
            
            # Initialize questioning session with organization context
            cls.questioning_sessions[problem_id] = {
                'problem_statement': problem_statement,
                'organization_name': organization_name,
                'geographic_location': geographic_location,
                'structured_statement': structured_statement,
                'question_count': 0,
                'answers': [],
                'context': problem_statement
            }
            
            # Generate first strategic question with organization context
            first_question = OpenAIService.generate_first_strategic_question(
                problem_statement, organization_name, geographic_location, structured_statement
            )
            
            # Store first question
            cls.questioning_sessions[problem_id]['question_count'] = 1
            cls.questioning_sessions[problem_id]['current_question'] = first_question['question']
            
            return {
                'problem_id': problem_id,
                'question': first_question['question'],
                'reasoning': first_question.get('reasoning', ''),
                'question_number': 1,
                'total_questions': 7,
                'confidence_level': first_question.get('confidence_level', 'low')
            }
            
        except Exception as e:
            logger.error(f"Error starting interactive questioning: {str(e)}")
            raise Exception(f"Failed to start interactive questioning: {str(e)}")
    
    @classmethod
    def continue_questioning(cls, problem_id, answer):
        """
        Continue the questioning session with user's answer
        """
        try:
            if problem_id not in cls.questioning_sessions:
                raise ValueError("No questioning session found for this problem ID")
            
            session = cls.questioning_sessions[problem_id]
            
            # Store the answer
            session['answers'].append({
                'question': session.get('current_question', ''),
                'answer': answer
            })
            
            # Check if we should continue or stop
            if session['question_count'] >= 7:
                return {
                    'completed': True, 
                    'reason': 'Maximum questions reached',
                    'total_answers': len(session['answers'])
                }
            
            # Generate next question based on context
            next_question_result = OpenAIService.generate_next_strategic_question(
                session['problem_statement'],
                session['answers']
            )
            
            if next_question_result.get('completed', False):
                return {
                    'completed': True,
                    'reason': next_question_result.get('reasoning', 'AI determined sufficient information gathered'),
                    'total_answers': len(session['answers'])
                }
            
            # Continue with next question
            session['question_count'] += 1
            session['current_question'] = next_question_result['question']
            
            return {
                'question': next_question_result['question'],
                'reasoning': next_question_result.get('reasoning', ''),
                'question_number': session['question_count'],
                'total_questions': 7,
                'confidence_level': next_question_result.get('confidence_level', 'medium'),
                'completed': False
            }
            
        except Exception as e:
            logger.error(f"Error continuing questioning: {str(e)}")
            raise Exception(f"Failed to continue questioning: {str(e)}")
    
    @classmethod
    def generate_comprehensive_solution(cls, problem_id):
        """
        Generate comprehensive analysis and recommendations based on all answers
        """
        try:
            if problem_id not in cls.questioning_sessions:
                raise ValueError("No questioning session found for this problem ID")
            
            session = cls.questioning_sessions[problem_id]
            
            # Generate comprehensive solution based on all answers
            solution = OpenAIService.generate_comprehensive_solution(
                session['problem_statement'],
                session['answers']
            )
            
            # Clean up session (optional - keep for audit trail)
            # del cls.questioning_sessions[problem_id]
            
            logger.info(f"Comprehensive solution generated for {problem_id}")
            return solution
            
        except Exception as e:
            logger.error(f"Error generating comprehensive solution: {str(e)}")
            raise Exception(f"Failed to generate comprehensive solution: {str(e)}")