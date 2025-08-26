import uuid
import logging
from app import db
from models import ProblemAnalysis, TechRecommendation
from services.openai_service import OpenAIService

logger = logging.getLogger(__name__)

class AnalysisService:
    @staticmethod
    def analyze_problem(problem_statement, analysis_mode='basic'):
        """
        Analyze a nonprofit problem statement using specified mode
        """
        try:
            # Generate unique problem ID
            problem_id = f"P{str(uuid.uuid4().hex[:8]).upper()}"
            
            # Choose analysis method based on mode
            if analysis_mode.lower() == 'enhanced':
                analysis_result = OpenAIService.analyze_problem_enhanced(problem_statement)
            else:
                analysis_result = OpenAIService.analyze_problem_basic(problem_statement)
            
            # Clean and sanitize response text to handle Unicode characters
            def clean_unicode(text):
                if not isinstance(text, str):
                    return text
                # Replace common problematic Unicode characters
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
                for old, new in replacements.items():
                    text = text.replace(old, new)
                return text
            
            description = clean_unicode(analysis_result.get('description', ''))
            
            # Also clean clarifying questions
            questions = analysis_result.get('clarifying_questions', [])
            if isinstance(questions, list):
                questions = [clean_unicode(q) for q in questions]
            
            # Store analysis in database
            analysis_record = ProblemAnalysis()
            analysis_record.problem_id = problem_id
            analysis_record.problem_statement = problem_statement
            analysis_record.description = description
            analysis_record.clarifying_questions = questions
            analysis_record.analysis_mode = analysis_mode.lower()
            
            db.session.add(analysis_record)
            db.session.commit()
            
            logger.info(f"Problem analysis completed: {problem_id} (mode: {analysis_mode})")
            
            return {
                'problem_id': problem_id,
                'description': analysis_result.get('description', ''),
                'clarifying_questions': analysis_result.get('clarifying_questions', []),
                'analysis_mode': analysis_mode.lower()
            }
            
        except Exception as e:
            logger.error(f"Analysis service error: {e}")
            db.session.rollback()
            raise Exception(f"Problem analysis failed: {str(e)}")

    @staticmethod
    def generate_recommendation(problem_id, description, clarifying_questions, analysis_mode='basic'):
        """
        Generate technology recommendations for a given problem
        """
        try:
            # Verify problem exists in database
            problem_record = ProblemAnalysis.query.filter_by(problem_id=problem_id).first()
            if not problem_record:
                raise Exception(f"Problem ID {problem_id} not found")
            
            # Choose recommendation method based on mode
            if analysis_mode.lower() == 'enhanced':
                recommendation_result = OpenAIService.generate_recommendations_enhanced(
                    problem_id, description, clarifying_questions
                )
            else:
                recommendation_result = OpenAIService.generate_recommendations_basic(
                    problem_id, description, clarifying_questions
                )
            
            # Clean Unicode characters in recommendation response
            def clean_unicode(text):
                if not isinstance(text, str):
                    return text
                replacements = {
                    '\u2019': "'", '\u2018': "'", '\u201c': '"', '\u201d': '"',
                    '\u2013': '-', '\u2014': '-', '\u2026': '...', '\u00a0': ' ',
                }
                for old, new in replacements.items():
                    text = text.replace(old, new)
                return text
            
            solution_summary = clean_unicode(recommendation_result.get('solution_summary', ''))
            tech_stack = recommendation_result.get('recommended_tech_stack', [])
            if isinstance(tech_stack, list):
                tech_stack = [clean_unicode(item) for item in tech_stack]
            initial_steps = recommendation_result.get('initial_steps', [])
            if isinstance(initial_steps, list):
                initial_steps = [clean_unicode(step) for step in initial_steps]
            
            # Store recommendation in database
            recommendation_record = TechRecommendation()
            recommendation_record.problem_id = problem_id
            recommendation_record.solution_summary = solution_summary
            recommendation_record.recommended_tech_stack = tech_stack
            recommendation_record.initial_steps = initial_steps
            recommendation_record.analysis_mode = analysis_mode.lower()
            
            db.session.add(recommendation_record)
            db.session.commit()
            
            logger.info(f"Recommendations generated: {problem_id} (mode: {analysis_mode})")
            
            return {
                'solution_summary': solution_summary,
                'recommended_tech_stack': tech_stack,
                'initial_steps': initial_steps,
                'analysis_mode': analysis_mode.lower()
            }
            
        except Exception as e:
            logger.error(f"Recommendation service error: {e}")
            db.session.rollback()
            raise Exception(f"Recommendation generation failed: {str(e)}")
