import uuid
import json
import logging
from src.services.openai_service import OpenAIService

logger = logging.getLogger(__name__)

class ProblemStructuringService:
    # Store structuring sessions in memory (in production, use database)
    structuring_sessions = {}
    
    @classmethod
    def start_structuring(cls, initial_challenge):
        """
        Start guided problem statement structuring for nonprofits
        """
        try:
            # Generate unique structuring ID
            structuring_id = f"PS{str(uuid.uuid4().hex[:8]).upper()}"
            
            # Initialize structuring session
            cls.structuring_sessions[structuring_id] = {
                'initial_challenge': initial_challenge,
                'current_step': 1,
                'responses': {},
                'template_components': {
                    'organization_context': None,
                    'trying_to_achieve': None,
                    'obstacles_barriers': None,
                    'root_causes': None,
                    'impact_on_mission': None
                }
            }
            
            # Generate first structuring prompt
            first_prompt = OpenAIService.generate_structuring_prompt(initial_challenge, step=1)
            
            # Store first prompt
            cls.structuring_sessions[structuring_id]['current_prompt'] = first_prompt
            
            return {
                'structuring_id': structuring_id,
                'step': 1,
                'total_steps': 5,
                'prompt_category': 'organization_context',
                'prompt': first_prompt['prompt'],
                'guidance': first_prompt.get('guidance', ''),
                'examples': first_prompt.get('examples', [])
            }
            
        except Exception as e:
            logger.error(f"Error starting problem structuring: {str(e)}")
            raise Exception(f"Failed to start problem structuring: {str(e)}")
    
    @classmethod
    def continue_structuring(cls, structuring_id, response):
        """
        Continue the structured problem statement development
        """
        try:
            if structuring_id not in cls.structuring_sessions:
                raise ValueError("No structuring session found for this ID")
            
            session = cls.structuring_sessions[structuring_id]
            
            # Store the response for current step
            step = session['current_step']
            step_categories = ['organization_context', 'trying_to_achieve', 'obstacles_barriers', 'root_causes', 'impact_on_mission']
            current_category = step_categories[step - 1]
            
            session['responses'][current_category] = response
            session['template_components'][current_category] = response
            
            # Check if we've completed all steps
            if step >= 5:
                return {
                    'completed': True,
                    'message': 'All components gathered. Ready to generate structured problem statement.',
                    'total_responses': len(session['responses'])
                }
            
            # Move to next step
            session['current_step'] = step + 1
            next_step = step + 1
            next_category = step_categories[next_step - 1]
            
            # Generate next prompt based on previous responses
            next_prompt = OpenAIService.generate_structuring_prompt(
                session['initial_challenge'], 
                step=next_step,
                previous_responses=session['responses']
            )
            
            session['current_prompt'] = next_prompt
            
            return {
                'step': next_step,
                'total_steps': 5,
                'prompt_category': next_category,
                'prompt': next_prompt['prompt'],
                'guidance': next_prompt.get('guidance', ''),
                'examples': next_prompt.get('examples', []),
                'completed': False
            }
            
        except Exception as e:
            logger.error(f"Error continuing structuring: {str(e)}")
            raise Exception(f"Failed to continue structuring: {str(e)}")
    
    @classmethod
    def complete_structuring(cls, structuring_id):
        """
        Generate final structured problem statement from all components
        """
        try:
            if structuring_id not in cls.structuring_sessions:
                raise ValueError("No structuring session found for this ID")
            
            session = cls.structuring_sessions[structuring_id]
            
            # Generate structured problem statement
            structured_statement = OpenAIService.generate_structured_problem_statement(
                session['initial_challenge'],
                session['template_components']
            )
            
            logger.info(f"Structured problem statement generated for {structuring_id}")
            return structured_statement
            
        except Exception as e:
            logger.error(f"Error completing structuring: {str(e)}")
            raise Exception(f"Failed to complete structuring: {str(e)}")
