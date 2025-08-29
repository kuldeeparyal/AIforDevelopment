import json
import os
import logging
from openai import OpenAI

# the newest OpenAI model is "gpt-5" which was released August 7, 2025.
# do not change this unless explicitly requested by the user
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
openai_client = OpenAI(api_key=OPENAI_API_KEY)

logger = logging.getLogger(__name__)

class OpenAIService:
    @staticmethod
    def analyze_problem_basic(problem_statement):
        """
        Basic analysis using GPT-5 for nonprofit problem statements
        """
        try:
            system_prompt = """You are an experienced nonprofit technology consultant specializing in identifying core operational challenges. Analyze problem statements and provide practical insights.

Respond with JSON in this exact format:
{
    "description": "Clear, concise summary of the specific problem (1-2 sentences)",
    "clarifying_questions": ["question 1", "question 2"] OR [] if problem is clearly understood
}

IMPORTANT: Use empty array [] for clarifying_questions if the problem statement provides enough detail to understand the core challenge and recommend solutions. Only include questions if critical information is missing that would significantly impact the solution design.

Focus on practical, implementation-ready insights. Keep clarifying questions minimal and targeted."""

            user_prompt = f"""Analyze this nonprofit problem statement:

"{problem_statement}"

Provide a concise analysis focusing on:
1. Core operational challenge (be specific and actionable)
2. Key technical gaps that need addressing
3. Essential clarifying questions (only if critical information is missing)"""

            response = openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                max_tokens=1000,
                temperature=0.3
            )
            
            if not response.choices or len(response.choices) == 0:
                raise Exception("No response choices from AI model")
            
            content = response.choices[0].message.content
            if not content or content.strip() == "":
                logger.error(f"Empty content in response: {response}")
                raise Exception("Empty response content from AI model")
            
            result = json.loads(content)
            logger.info(f"Basic analysis completed successfully")
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error in basic analysis: {e}")
            raise Exception("Failed to parse AI response")
        except Exception as e:
            logger.error(f"OpenAI API error in basic analysis: {e}")
            raise Exception(f"AI analysis failed: {str(e)}")

    @staticmethod
    def analyze_problem_enhanced(problem_statement, organization_name=None, geographic_location=None):
        """
        Enhanced analysis using GPT-5 with advanced strategic reasoning for nonprofit contexts
        """
        try:
            system_prompt = """You are an expert nonprofit technology consultant with deep strategic expertise. Analyze problem statements using advanced reasoning to identify root causes and critical information gaps.

Your analysis should focus on:
1. Root causes and systemic issues (not just symptoms)
2. Organizational context and constraints
3. Strategic information gaps that affect solution design
4. Mission alignment and stakeholder impact

When organization name and geographic location are provided, incorporate this context into your clarifying questions to make them more specific and relevant. Consider:
- Local regulations, compliance requirements, and funding landscapes
- Regional technology infrastructure and digital literacy
- Cultural considerations and community-specific needs
- Local partnership opportunities and resource availability

Generate strategic clarifying questions in these key areas:
- Organizational capacity and resources
- Current systems and integration needs
- Scale, compliance, and sustainability factors
- Success metrics and change management readiness
- Geographic and regulatory context (when location provided)

Respond with JSON in this exact format:
{
    "description": "Comprehensive analysis of root causes and broader impact (2-3 sentences)",
    "clarifying_questions": ["strategic question 1", "question 2", ...] or [] if clear
}

Rules: Maximum 7 strategic questions. Focus on critical unknowns that dramatically impact solution architecture."""

            # Build context-aware user prompt
            context_info = ""
            if organization_name:
                context_info += f"Organization: {organization_name}\n"
            if geographic_location:
                context_info += f"Location: {geographic_location}\n"
            
            user_prompt = f"""Analyze this nonprofit problem statement:

{context_info}
Problem: "{problem_statement}"

Focus on root causes, systemic issues, and strategic questions needed for optimal solution design. Consider nonprofit constraints: limited budgets, volunteer capacity, compliance needs, and long-term sustainability.

{"When generating clarifying questions, incorporate the organization's location and context to make questions more specific and actionable." if context_info else ""}"""

            response = openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                max_tokens=2000,
                temperature=0.3
            )
            
            content = response.choices[0].message.content
            if not content or content.strip() == "":
                raise Exception("Empty response from AI model - please try again")
            
            result = json.loads(content)
            logger.info(f"Enhanced analysis completed successfully")
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error in enhanced analysis: {e}")
            raise Exception("Failed to parse AI response")
        except Exception as e:
            logger.error(f"OpenAI API error in enhanced analysis: {e}")
            raise Exception(f"AI analysis failed: {str(e)}")

    @staticmethod
    def generate_recommendations_basic(problem_id, description, clarifying_questions):
        """
        Generate basic technical recommendations
        """
        try:
            prompt = f"""You are a nonprofit technology consultant generating practical technology recommendations.

Problem ID: {problem_id}
Problem Description: {description}
Additional Context: {clarifying_questions}

Generate a focused technology recommendation that:
1. Directly addresses the core problem
2. Uses cost-effective, proven solutions
3. Considers typical nonprofit resource constraints

Provide your recommendation as JSON with exactly these fields:
- solution_summary: Brief overview of recommended approach (2-3 sentences)
- recommended_tech_stack: Array of specific tools/technologies (3-5 items)
- initial_steps: Array of actionable first steps (3-5 specific actions)

Focus on:
- Open source or affordable SaaS solutions
- Minimal technical complexity
- Quick implementation wins
- Proven nonprofit technology stacks"""

            response = openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a practical nonprofit technology consultant. Respond only with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                max_tokens=1200
            )
            
            content = response.choices[0].message.content
            if not content or content.strip() == "":
                raise Exception("Empty response from AI model - please try again")
            
            result = json.loads(content)
            logger.info(f"Basic recommendations generated successfully for {problem_id}")
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error in basic recommendations: {e}")
            raise Exception("Failed to parse AI response")
        except Exception as e:
            logger.error(f"OpenAI API error in basic recommendations: {e}")
            raise Exception(f"AI recommendation generation failed: {str(e)}")

    @staticmethod
    def generate_recommendations_enhanced(problem_id, description, clarifying_questions):
        """
        Generate comprehensive technology strategy with advanced strategic reasoning
        """
        try:
            system_prompt = """You are a senior nonprofit technology strategist with expertise in designing comprehensive, sustainable technology solutions. You excel at creating multi-phased implementation strategies that balance organizational readiness with transformational impact.

Your task is to design a complete technology strategy that addresses both immediate needs and long-term organizational transformation. Consider the unique constraints and opportunities within nonprofit environments.

Key principles for your recommendations:
1. Phased implementation approach (quick wins + strategic transformation)
2. Integration with existing organizational systems and workflows
3. Sustainability planning (maintenance, scaling, funding)
4. Change management and adoption strategy
5. Measurement framework and success metrics
6. Risk mitigation and contingency planning
7. Stakeholder alignment and governance

Technology architecture considerations:
- Data flow optimization and integration complexity
- Security, compliance, and privacy requirements
- Scalability and performance requirements
- Vendor ecosystem and long-term partnerships
- Technical debt management and modernization path
- Disaster recovery and business continuity

Respond with JSON in exactly this format:
{
    "solution_summary": "Comprehensive strategic overview including implementation phases, key benefits, and transformation approach (3-4 sentences)",
    "recommended_tech_stack": ["Tool 1 - Strategic rationale and role in solution", "Tool 2 - Integration approach and benefits", ...],
    "initial_steps": ["Phase 1 action with timeline and stakeholder requirements", "Phase 2 action with dependencies and success criteria", ...]
}

Ensure recommendations are:
- Practical and achievable given nonprofit constraints
- Strategic in approach with clear ROI and impact metrics  
- Sustainable with realistic resource requirements
- Scalable to grow with organizational needs"""

            user_prompt = f"""Design a comprehensive technology strategy for this nonprofit challenge:

Problem ID: {problem_id}
Core Challenge: {description}
Strategic Context: {clarifying_questions}

Create a sophisticated, multi-layered technology solution that addresses immediate operational needs while building toward long-term organizational transformation. Consider stakeholder complexity, resource constraints, change management requirements, and sustainability factors unique to nonprofit environments."""

            response = openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                max_tokens=2500
            )
            
            content = response.choices[0].message.content
            if not content or content.strip() == "":
                raise Exception("Empty response from AI model - please try again")
            
            result = json.loads(content)
            logger.info(f"Enhanced recommendations generated successfully for {problem_id}")
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error in enhanced recommendations: {e}")
            raise Exception("Failed to parse AI response")
        except Exception as e:
            logger.error(f"OpenAI API error in enhanced recommendations: {e}")
            raise Exception(f"AI recommendation generation failed: {str(e)}")

    @staticmethod
    def generate_first_strategic_question(problem_statement, organization_name=None, geographic_location=None, structured_statement=None):
        """
        Generate the first strategic question for interactive questioning
        """
        try:
            system_prompt = """You are an expert nonprofit technology consultant with 15+ years of experience in digital transformation for mission-driven organizations. You excel at strategic questioning that uncovers root causes and critical success factors.

Your approach:
- Ask penetrating questions that reveal systemic issues, not just surface symptoms
- Understand nonprofit-specific constraints: funding cycles, board governance, volunteer management, compliance requirements
- Focus on sustainability, scalability, and mission alignment in technology decisions
- Identify hidden dependencies, integration challenges, and change management risks
- Consider the human impact - how technology changes affect staff, volunteers, and beneficiaries

When a structured problem statement is provided, use it to ask more targeted questions that build on their self-awareness. The structured format reveals their perspective on:
- Identity and role ("We are...")
- Goals and aspirations ("We are trying to...")
- Obstacles and barriers ("But...")
- Root causes ("Because...")
- Emotional impact ("Which makes us feel...")

Your questioning strategy:
1. Start with the most critical gap that affects solution architecture
2. Probe deeper into root causes revealed in their structured statement
3. Uncover constraints and dependencies they may not have mentioned
4. Understand their organizational readiness for change
5. Identify success metrics that align with their mission

Respond with JSON in this format:
{
    "question": "Your specific, strategic first question",
    "reasoning": "Why this question reveals the most critical information gap",
    "confidence_level": "low"
}

Rules: Ask ONE penetrating question that gets to the heart of their challenge."""

            # Build comprehensive context-aware user prompt
            context_info = ""
            if organization_name:
                context_info += f"Organization: {organization_name}\n"
            if geographic_location:
                context_info += f"Location: {geographic_location}\n"
            
            structured_info = ""
            if structured_statement:
                structured_info = f"""\n\nStructured Problem Statement:
- We are: {structured_statement['we_are']}
- We are trying to: {structured_statement['we_are_trying_to']}
- But: {structured_statement['but']}
- Because: {structured_statement['because']}
- Which makes us feel: {structured_statement['which_makes_us_feel']}

Use this structured insight to ask a more targeted question that builds on their self-awareness and digs deeper into the root causes or constraints they've identified."""
            
            user_prompt = f"""Conduct strategic questioning for this nonprofit:

{context_info}Problem Statement: "{problem_statement}"{structured_info}

Generate the first strategic question that:
1. Addresses the most critical information gap for solution design
2. Builds on their existing awareness (if structured statement provided)
3. Incorporates their organizational and geographic context
4. Gets to root causes, not surface symptoms
5. Considers nonprofit-specific constraints and mission alignment

This should be the most important question to ask first to understand their challenge deeply."""

            response = openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                max_tokens=800
            )
            
            content = response.choices[0].message.content
            if not content or content.strip() == "":
                raise Exception("Empty response from AI model")
            
            result = json.loads(content)
            logger.info("First strategic question generated successfully")
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error in first question: {e}")
            raise Exception("Failed to parse AI response")
        except Exception as e:
            logger.error(f"OpenAI API error in first question: {e}")
            raise Exception(f"AI first question generation failed: {str(e)}")

    @staticmethod
    def generate_next_strategic_question(problem_statement, previous_answers):
        """
        Generate the next strategic question based on previous answers
        """
        try:
            qa_context = "\n".join([
                f"Q{i+1}: {qa['question']}\nA{i+1}: {qa['answer']}"
                for i, qa in enumerate(previous_answers)
            ])

            system_prompt = """You are continuing an intelligent questioning session with a nonprofit. Based on their previous answers, determine if you need more information or have enough to provide comprehensive recommendations.

If you need more information, ask the next most strategic question that builds on previous answers.
If you're confident you have enough information, respond with completion signal.

Respond with JSON in this format:
{
    "question": "Your next specific question" OR null if done,
    "reasoning": "Why this question is needed" OR "Why you have sufficient information",
    "confidence_level": "low/medium/high",
    "completed": true/false
}"""

            user_prompt = f"""Continue the questioning session:

Original Problem: {problem_statement}

Previous Questions and Answers:
{qa_context}

Current question count: {len(previous_answers)} of 7 maximum

Should you ask another question or do you have sufficient information for comprehensive recommendations?"""

            response = openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                max_tokens=800
            )
            
            content = response.choices[0].message.content
            if not content or content.strip() == "":
                raise Exception("Empty response from AI model")
            
            result = json.loads(content)
            logger.info("Next strategic question generated successfully")
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error in next question: {e}")
            raise Exception("Failed to parse AI response")
        except Exception as e:
            logger.error(f"OpenAI API error in next question: {e}")
            raise Exception(f"AI next question generation failed: {str(e)}")

    @staticmethod
    def generate_comprehensive_solution(problem_statement, answers):
        """
        Generate comprehensive solution based on all interactive questioning answers
        """
        try:
            qa_context = "\n".join([
                f"Q{i+1}: {qa['question']}\nA{i+1}: {qa['answer']}"
                for i, qa in enumerate(answers)
            ])

            system_prompt = """You are a senior nonprofit AI strategist. 
Your task is to design a comprehensive, multi-layered AI-driven solution for nonprofits 
based on detailed interactive questioning.

Focus ONLY on AI-based technologies and methods, including:
- Generative AI (LLMs, chatbots, content creation, multilingual translation)
- Reasoning AI (decision support, automated planning, recommendation systems)
- AI-powered automation (workflow automation, speech-to-text, OCR, predictive analytics)
- Responsible AI governance (bias, transparency, compliance, digital equity)
- Sustainable adoption (low-cost SaaS with NGO discounts, open-source AI frameworks, hybrid models)

Guidelines:
- Frame ALL recommendations as AI-first solutions (not generic IT).
- Show how AI specifically addresses the nonprofit’s challenges and constraints.
- Emphasize low-cost, ethical, and scalable AI options suitable for nonprofits.
- Always include success metrics that show clear nonprofit impact (time saved, beneficiaries reached, cost reduced).
- Address ethical considerations explicitly: data privacy, fairness, accessibility, digital inclusion, and cultural sensitivity.

Respond with JSON in this format:
{
    "analysis_summary": "Deep analysis of root causes and strategic context (3-4 sentences)",
    "solution_summary": "Comprehensive strategic overview of the AI driven solution with implementation phases (3-4 sentences)",
    "recommended_tech_stack": ["Tool 1 - Strategic rationale", "Tool 2 - Integration approach", ...],
    "initial_steps": ["Phase 1 action with timeline", "Phase 2 action with dependencies", ...],
    "success_metrics": ["Metric 1 - measurement approach", "Metric 2 - timeline", ...],
    "risk_mitigation": ["Risk 1 - mitigation strategy", "Risk 2 - contingency plan", ...],
    "ethical_considerations": ["Data privacy and donor confidentiality measures", "Accessibility and digital equity concerns", "Vendor ethics and social responsibility", "Transparency and accountability in technology choices", ...]
}

Ensure recommendations are practical, strategic, sustainable, scalable, and ethically responsible. Address key nonprofit ethical concerns including data privacy, accessibility, funding transparency, and equitable access to services."""

            user_prompt = f"""Design a comprehensive technology strategy based on this detailed context:

Original Problem: {problem_statement}

Detailed Context from Interactive Questioning:
{qa_context}

Create a sophisticated, AI driven solution addressing immediate needs and long-term transformation. Consider all constraints and opportunities revealed through questioning.

Pay special attention to ethical considerations relevant to nonprofit operations:
- Data privacy and confidentiality (donor, client, volunteer information)
- Digital accessibility for diverse populations
- Vendor selection based on social responsibility
- Transparency in technology decision-making
- Equitable access to digital services
- Responsible use of AI and automation
- Environmental impact of technology choices
- Cultural sensitivity and community representation"""

            response = openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                max_tokens=3000
            )
            
            content = response.choices[0].message.content
            if not content or content.strip() == "":
                raise Exception("Empty response from AI model")
            
            result = json.loads(content)
            logger.info("Comprehensive solution generated successfully")
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error in comprehensive solution: {e}")
            raise Exception("Failed to parse AI response")
        except Exception as e:
            logger.error(f"OpenAI API error in comprehensive solution: {e}")
            raise Exception(f"AI comprehensive solution generation failed: {str(e)}")

    @staticmethod
    def generate_structuring_prompt(initial_challenge, step, previous_responses=None):
        """
        Generate structured prompts for problem statement development
        """
        try:
            prompts = {
                1: {
                    'category': 'organization_context',
                    'system_prompt': """You are an expert nonprofit consultant helping organizations articulate their challenges clearly. Guide them to provide rich organizational context that will enable better problem analysis.

Generate a focused prompt that helps them describe their organizational context in 2-3 sentences.""",
                    'user_prompt': f"""The nonprofit mentioned this initial challenge: "{initial_challenge}"

Create a prompt that helps them provide essential organizational context. Focus on:
- Organization type, size, and primary mission
- Who they serve and how
- Current operational context

Respond with JSON:
{{
    "prompt": "Your specific question to gather organizational context",
    "guidance": "Brief guidance on what good context includes",
    "examples": ["Example answer 1", "Example answer 2"]
}}"""
                },
                2: {
                    'category': 'trying_to_achieve',
                    'system_prompt': """You are helping a nonprofit clearly articulate what they're trying to accomplish. Based on their organizational context, help them define their specific goals and desired outcomes.""",
                    'user_prompt': f"""Initial challenge: "{initial_challenge}"

Organizational context: "{previous_responses.get('organization_context', '') if previous_responses else ''}"

Create a prompt that helps them clearly define what they're trying to achieve. Focus on:
- Specific goals and outcomes they want
- Who would benefit and how
- Success metrics they envision

Respond with JSON:
{{
    "prompt": "Your specific question about their goals",
    "guidance": "How to articulate clear, measurable objectives",
    "examples": ["Example goal statement 1", "Example goal statement 2"]
}}"""
                },
                3: {
                    'category': 'obstacles_barriers',
                    'system_prompt': """You are helping a nonprofit identify the specific obstacles and barriers preventing them from achieving their goals. Focus on concrete, actionable barriers rather than vague statements.""",
                    'user_prompt': f"""Initial challenge: "{initial_challenge}"

Context: "{previous_responses.get('organization_context', '') if previous_responses else ''}"
Goals: "{previous_responses.get('trying_to_achieve', '') if previous_responses else ''}"

Create a prompt that helps them identify specific obstacles. Focus on:
- Concrete barriers preventing goal achievement
- System/process breakdowns
- Resource or capacity constraints

Respond with JSON:
{{
    "prompt": "Your specific question about barriers and obstacles",
    "guidance": "How to identify specific, actionable barriers",
    "examples": ["Example barrier description 1", "Example barrier description 2"]
}}"""
                },
                4: {
                    'category': 'root_causes',
                    'system_prompt': """You are helping a nonprofit dig deeper into the root causes behind their obstacles. Guide them to think beyond symptoms to underlying systemic issues.""",
                    'user_prompt': f"""Initial challenge: "{initial_challenge}"

Context: "{previous_responses.get('organization_context', '') if previous_responses else ''}"
Goals: "{previous_responses.get('trying_to_achieve', '') if previous_responses else ''}"
Obstacles: "{previous_responses.get('obstacles_barriers', '') if previous_responses else ''}"

Create a prompt that helps them identify root causes. Focus on:
- Why these obstacles exist in the first place
- Systemic or structural issues
- Underlying resource, process, or capacity gaps

Respond with JSON:
{{
    "prompt": "Your specific question about root causes",
    "guidance": "How to think about underlying systemic issues",
    "examples": ["Example root cause analysis 1", "Example root cause analysis 2"]
}}"""
                },
                5: {
                    'category': 'impact_on_mission',
                    'system_prompt': """You are helping a nonprofit connect their operational challenges to their mission impact. This helps prioritize solutions and build urgency for change.""",
                    'user_prompt': f"""Initial challenge: "{initial_challenge}"

Context: "{previous_responses.get('organization_context', '') if previous_responses else ''}"
Goals: "{previous_responses.get('trying_to_achieve', '') if previous_responses else ''}"
Obstacles: "{previous_responses.get('obstacles_barriers', '') if previous_responses else ''}"
Root causes: "{previous_responses.get('root_causes', '') if previous_responses else ''}"

Create a prompt that helps them articulate mission impact. Focus on:
- How these challenges affect their ability to serve their mission
- Impact on beneficiaries or community
- Consequences of not addressing these issues

Respond with JSON:
{{
    "prompt": "Your specific question about mission impact",
    "guidance": "How to connect operational issues to mission outcomes",
    "examples": ["Example mission impact statement 1", "Example mission impact statement 2"]
}}"""
                }
            }
            
            prompt_config = prompts[step]
            
            response = openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": prompt_config['system_prompt']},
                    {"role": "user", "content": prompt_config['user_prompt']}
                ],
                response_format={"type": "json_object"},
                max_tokens=800
            )
            
            content = response.choices[0].message.content
            if not content or content.strip() == "":
                raise Exception("Empty response from AI model")
            
            result = json.loads(content)
            result['category'] = prompt_config['category']
            logger.info(f"Structuring prompt generated for step {step}")
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error in structuring prompt: {e}")
            raise Exception("Failed to parse AI response")
        except Exception as e:
            logger.error(f"OpenAI API error in structuring prompt: {e}")
            raise Exception(f"AI structuring prompt generation failed: {str(e)}")

    @staticmethod
    def generate_structured_problem_statement(initial_challenge, components):
        """
        Generate final structured problem statement from all components
        """
        try:
            system_prompt = """You are an expert nonprofit consultant creating a comprehensive, well-structured problem statement from gathered components. Create a coherent narrative that will enable strategic technology recommendations.

Respond with JSON in this format:
{
    "structured_problem_statement": "Complete, well-articulated problem statement that integrates all components",
    "key_components": {
        "organization_context": "Refined organizational context",
        "objectives": "Clear goals and desired outcomes", 
        "barriers": "Specific obstacles preventing success",
        "root_causes": "Underlying systemic issues",
        "mission_impact": "How this affects mission delivery"
    },
    "problem_clarity_score": "high | medium | low",
    "readiness_for_analysis": true
}"""

            components_text = "\n".join([
                f"Organization Context: {components.get('organization_context', '')}",
                f"Goals/Objectives: {components.get('trying_to_achieve', '')}",
                f"Obstacles/Barriers: {components.get('obstacles_barriers', '')}",
                f"Root Causes: {components.get('root_causes', '')}",
                f"Mission Impact: {components.get('impact_on_mission', '')}"
            ])

            user_prompt = f"""Create a comprehensive problem statement from these components:

Initial Challenge: "{initial_challenge}"

Structured Components:
{components_text}

Synthesize these into a coherent, actionable problem statement that enables strategic technology analysis and recommendations."""

            response = openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                max_tokens=1500
            )
            
            content = response.choices[0].message.content
            if not content or content.strip() == "":
                raise Exception("Empty response from AI model")
            
            result = json.loads(content)
            logger.info("Structured problem statement generated successfully")
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error in structured problem statement: {e}")
            raise Exception("Failed to parse AI response")
        except Exception as e:
            logger.error(f"OpenAI API error in structured problem statement: {e}")
            raise Exception(f"AI structured problem statement generation failed: {str(e)}")
