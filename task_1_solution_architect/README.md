# AI Architect for Nonprofit Solutions - Task 1

**Built for Tech To The Rescue - AI Enablement Lead Position**

An AI-powered Flask API server that analyzes nonprofit problem statements and generates tailored technology recommendations. The system uses OpenAI's GPT-4o model to provide comprehensive, implementable solutions specifically designed for nonprofit organizations.

## Features

### 🎯 **Two Analysis Approaches**
- **Simple Analysis**: Quick problem-to-solution workflow with exact specification compliance
- **Enhanced Analysis**: Strategic questioning incorporating organization context and geographic location

### 📍 **Context-Aware Questioning**
- Questions reference specific organization names and geographic locations
- Incorporates local regulations, resources, and cultural considerations
- Builds on structured problem statement development

### 🔄 **Structured Problem Development**
- Adapted customer problem template for nonprofit contexts
- 5-step guided process: "we are/trying to/but/because/which makes us feel"
- Systematic problem articulation before strategic questioning

### 🛡️ **Ethical Technology Guidance**
- Built-in ethical considerations for all enhanced analysis
- Addresses data privacy, accessibility, and digital equity
- Vendor ethics and social responsibility evaluation
- Transparency and accountability in technology choices

### 🏢 **Organization-Aware Problem IDs**
- Enhanced analysis generates problem IDs incorporating organization abbreviations
- Example: `IPCCF3CA48` (Portland Community Center + unique suffix)
- Easy identification of which organization each analysis belongs to

## Table of Contents
- [Installation and Usage Instructions](#installation-and-usage-instructions)
- [API Endpoints](#api-endpoints)
- [Analysis Modes Comparison](#analysis-modes-comparison)
- [Demo Cases](#demo-cases)
- [Enhanced Analysis Workflow](#enhanced-analysis-workflow)
- [Task-Specific Critique](#task-specific-critique)
- [Prompt Engineering Approach](#prompt-engineering-approach)
- [Technical Implementation](#technical-implementation)

## Installation and Usage Instructions

### Prerequisites
- Python 3.8 or higher
- OpenAI API key (GPT-4o access required)
- pip package manager

### Quick Start Installation

1. **Clone the repository and navigate to Task 1:**
   ```bash
   cd task_1_solution_architect
   ```

2. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env file and add your actual API keys:
   # OPENAI_API_KEY=your_actual_openai_api_key_here
   # SESSION_SECRET=your_secure_session_secret_here
   
   # Or set environment variables directly:
   export OPENAI_API_KEY=your_openai_api_key_here
   export SESSION_SECRET=your_session_secret_here
   ```

3. **Install dependencies:**
   ```bash
   pip install -r src/requirements.txt
   ```
   
   Required packages:
   - Flask==3.0.3
   - Flask-SQLAlchemy==3.1.1
   - SQLAlchemy==2.0.23
   - openai==1.35.7
   - gunicorn==23.0.0
   - Werkzeug==3.0.3

4. **Run the server:**
   ```bash
   # Option 1: For development (from task_1_solution_architect directory):
   python run.py
   
   # Option 2: Using gunicorn (production):
   cd src && gunicorn --bind 0.0.0.0:5000 main:app
   
   # Option 3: From src directory directly:
   cd src && python main.py
   ```

5. **Access the application:**
   - API Base URL: http://localhost:5000
   - Health Check: http://localhost:5000/

## API Endpoints

### Simple Analysis Workflow

#### `/analyze` - Problem Analysis (Exact Specification)
Analyzes nonprofit problem statements with exact compliance to specification.

**Request:**
```json
{
  "problem_statement": "string - The nonprofit's challenge description"
}
```

**Response:**
```json
{
  "problem_id": "string - Unique identifier (e.g., P12345678)",
  "description": "string - Problem analysis summary",
  "clarifying_questions": ["array", "of", "questions", "or", "empty"]
}
```

#### `/recommend` - Generate Recommendations  
Generates technical recommendations based on analyzed problems.

**Request:**
```json
{
  "problem_id": "string - From analyze endpoint",
  "description": "string - Problem description", 
  "clarifying_questions": ["array", "of", "answered", "questions"]
}
```

**Response:**
```json
{
  "solution_summary": "string - High-level solution overview",
  "recommended_tech_stack": ["array", "of", "technologies"],
  "initial_steps": ["array", "of", "actionable", "steps"]
}
```

### Enhanced Analysis Workflow

#### `/analyze/interactive` - Start Enhanced Session
Begins enhanced analysis with organization context and strategic questioning.

**Request:**
```json
{
  "problem_statement": "string - The nonprofit's challenge description",
  "organization_name": "string - Required for enhanced analysis",
  "geographic_location": "string - Required for enhanced analysis",
  "structured_problem_statement": {
    "we_are": "string - Organization identity",
    "we_are_trying_to": "string - Goals and aspirations",
    "but": "string - Current obstacles",
    "because": "string - Root causes",
    "which_makes_us_feel": "string - Emotional impact"
  }
}
```

**Response:**
```json
{
  "problem_id": "string - Organization-aware ID (e.g., IPCCF3CA48)",
  "question": "string - Context-aware strategic question",
  "reasoning": "string - Why this question is critical",
  "question_number": 1,
  "total_questions": 7,
  "confidence_level": "low | medium | high"
}
```

#### `/analyze/interactive/continue` - Continue Questioning
Provides answer and receives next strategic question.

**Request:**
```json
{
  "problem_id": "string - Session ID from start",
  "answer": "string - Answer to previous question"
}
```

**Response:**
```json
{
  "question": "string - Next strategic question (or null if complete)",
  "reasoning": "string - Strategic rationale",
  "question_number": "number - Current question number",
  "confidence_level": "low | medium | high",
  "completed": false
}
```

#### `/analyze/interactive/complete` - Generate Final Solution
Creates comprehensive recommendations based on all questioning context.

**Request:**
```json
{
  "problem_id": "string - Session ID"
}
```

**Response:**
```json
{
  "analysis_summary": "string - Deep root cause analysis",
  "solution_summary": "string - Strategic transformation overview",
  "recommended_tech_stack": ["array", "with", "strategic", "rationale"],
  "initial_steps": ["phased", "implementation", "steps"],
  "success_metrics": ["measurable", "outcomes"],
  "risk_mitigation": ["risk", "management", "strategies"],
  "ethical_considerations": ["data privacy measures", "accessibility requirements", "vendor ethics", "transparency guidelines"],
  "total_questions_asked": "number",
  "confidence_level": "high"
}
```

## Analysis Modes Comparison

| Feature | Simple Analysis | Enhanced Analysis |
|---------|----------------|-------------------|
| **Input Requirements** | Problem statement only | + Organization name + Geographic location |
| **Problem ID Format** | Basic (P12345678) | Organization-aware (IPCCF3CA48) |
| **Questioning Style** | All at once | Progressive, context-building |
| **Question Focus** | Basic clarification | Strategic, organization-specific |
| **Geographic Awareness** | None | Incorporates local context |
| **Solution Depth** | Quick, practical | Comprehensive, strategic |
| **Ethical Guidance** | Basic considerations | Comprehensive ethical framework |
| **Implementation** | Immediate tools | Phased transformation |
| **Best For** | Clear problems, quick wins | Complex challenges, strategic planning |

## Demo Cases

### 📁 **1_simple_analysis**
Real API demonstrations of the basic workflow:

- **`food_bank_inventory.json`** - **Real API Response Demo**
  - Food bank inventory management challenges
  - Shows actual server responses from working API
  - Demonstrates basic analyze → recommend workflow

- **`animal_shelter_management.json`** - **Empty Clarifying Questions Example**
  - Animal shelter with 50 volunteers and 300 animals
  - Shows when AI determines problem is clearly understood
  - Real API response with `clarifying_questions: []`

### 📁 **2_enhanced_analysis**
Context-aware strategic analysis demonstrations:

- **`community_center_interactive.json`** - **Organization Context Demo**
  - Portland Community Center with problem ID `IPCCF3CA48`
  - Shows organization abbreviation in problem ID (PCC)
  - Context-aware questions referencing Portland's nonprofit ecosystem

- **`structured_problem_development.json`** - **5-Step Problem Framework**
  - Demonstrates structured problem statement development
  - "We are/trying to/but/because/which makes us feel" template
  - Integration with enhanced analysis workflow

- **`organization_abbreviation_examples.json`** - **Problem ID Examples**
  - Portland Community Center → PCC → `IPCCF3CA48`
  - Riverside Animal Shelter Foundation → RASF → `IRASFC6A99B`
  - The Food Bank of Central Valley → FBCV → `IFBCVA6847F`

- **`ethical_considerations_example.json`** - **Ethical Framework Demo**
  - Shows comprehensive ethical considerations output
  - Covers data privacy, accessibility, vendor ethics, transparency
  - Demonstrates practical implementation guidance

## Enhanced Analysis Workflow

### Step 1: Start Organization-Aware Session
```bash
curl -X POST http://localhost:5000/analyze/interactive \
  -H "Content-Type: application/json" \
  -d '{
    "problem_statement": "Your nonprofit challenge",
    "organization_name": "Portland Community Center",
    "geographic_location": "Portland, Oregon, USA",
    "structured_problem_statement": {
      "we_are": "a community center serving 500 families",
      "we_are_trying_to": "improve our programs",
      "but": "we lack coordination systems",
      "because": "everything is managed manually",
      "which_makes_us_feel": "overwhelmed and inefficient"
    }
  }'
```

**AI Response Features:**
- Problem ID includes organization abbreviation (e.g., `IPCCF3CA48`)
- Questions reference specific organization and location
- Builds on structured problem awareness

### Step 2: Context-Building Questions
```bash
curl -X POST http://localhost:5000/analyze/interactive/continue \
  -H "Content-Type: application/json" \
  -d '{"problem_id": "IPCCF3CA48", "answer": "Detailed organizational context"}'
```

**AI Behavior:**
- Questions incorporate organization name and location
- References local resources and regulations
- Builds strategic context from structured problem statement

### Step 3: Generate Strategic Solution
```bash
curl -X POST http://localhost:5000/analyze/interactive/complete \
  -H "Content-Type: application/json" \
  -d '{"problem_id": "IPCCF3CA48"}'
```

## Task-Specific Critique

### Current Implementation Strengths

#### ✅ **API Specification Compliance**
- **Simple Analysis**: Exactly matches specification with only `problem_statement` input
- **Response Format**: Clean JSON with `problem_id`, `description`, `clarifying_questions`
- **No Extra Fields**: Removed `analysis_mode` and `success` fields per requirements

#### ✅ **Enhanced Analysis Innovation** 
- **Organization Context**: Required `organization_name` and `geographic_location`
- **Smart Problem IDs**: Incorporates organization abbreviations (e.g., `IPCCF3CA48`)
- **Structured Development**: 5-step problem statement framework adapted for nonprofits

#### ✅ **Real API Testing**
- **Working Implementation**: Fixed GPT-5 → GPT-4o model issues
- **Authentic Demo Cases**: All examples use real server responses
- **Error Resolution**: Proper parameter handling and response validation

### Design Excellence

#### 🎯 **Strategic Differentiation**
```javascript
// Simple Analysis: Quick and Compliant
POST /analyze → {problem_statement} → {problem_id, description, clarifying_questions}

// Enhanced Analysis: Strategic, Context-Aware, and Ethically Guided
POST /analyze/interactive → {+organization_name, +geographic_location, +structured_statement}
→ Final output includes comprehensive ethical_considerations array
```

#### 🏢 **Organization Intelligence**
- **Abbreviation Logic**: Skips common words, takes first letters (max 4 chars)
- **Problem ID Examples**: 
  - Portland Community Center → `PCC` → `IPCCF3CA48`
  - The Food Bank of Central Valley → `FBCV` → `IFBCVA6847F`

#### 📍 **Geographic Awareness**
- Questions reference local nonprofit ecosystems
- Incorporates regional regulations and resources
- Cultural and community-specific considerations

### Areas for Enhancement

#### 🔄 **Session Management**
- **Current**: In-memory storage (development appropriate)
- **Production Need**: Database-backed persistent sessions
- **Scaling**: Redis or similar for distributed sessions

#### 📊 **Analytics Integration**
- **Missing**: Success tracking and recommendation effectiveness
- **Opportunity**: Long-term impact measurement
- **Enhancement**: Integration with nonprofit CRM systems

#### 🌐 **Multi-Language Support**
- **Current**: English-only strategic questioning
- **Global Need**: Internationalization for worldwide nonprofits
- **Cultural**: Localized problem-solving approaches

### Technical Architecture Assessment

#### ✅ **Strengths**
1. **Clean Separation**: Simple vs Enhanced modes serve different use cases
2. **Progressive Disclosure**: Enhanced mode builds context systematically
3. **Error Handling**: Robust validation and response management
4. **Modular Design**: Service-based architecture for maintainability

#### ⚠️ **Trade-offs**
1. **Memory vs Persistence**: In-memory sessions vs database complexity
2. **Simplicity vs Features**: Basic mode intentionally limited per specification
3. **AI Cost vs Quality**: More context means higher token usage

#### 🚀 **Innovation Points**
1. **Organization-Aware IDs**: Unique approach to problem tracking
2. **Structured Problem Framework**: Systematic nonprofit problem articulation
3. **Context Integration**: Questions build on organizational awareness
4. **Ethical AI Integration**: Built-in ethical considerations for responsible technology recommendations
5. **Real-World Testing**: Demo cases use actual API responses

### Compliance and Specification Analysis

#### ✅ **Exact Specification Match**
- Simple analysis endpoints match requirements precisely
- No deviation from specified input/output formats
- Clean JSON responses without extra metadata

#### 🎯 **Enhanced Value Addition**
- Enhanced mode adds significant value beyond requirements
- Organization context creates more relevant solutions
- Geographic awareness improves recommendation quality

#### 📋 **Production Readiness**
- Working API with proper error handling
- Real demo cases with actual server responses
- Scalable architecture for nonprofit deployment

## Prompt Engineering Approach

### Adaptive Prompt Strategy
The system uses three distinct prompt engineering approaches:

1. **Simple Analysis**: Focused on practical, immediate solutions
2. **Enhanced Analysis**: Root cause analysis with strategic thinking
3. **Interactive Questioning**: Progressive context building with each iteration

### Organization-Aware Prompting
```
System: You are analyzing [Organization Name] in [Geographic Location]...
Context: Structured Problem Statement shows they are aware that...
Question: Building on their self-identified challenges...
```

### Key Techniques
- **Context Integration**: Each prompt incorporates organizational awareness
- **Geographic Relevance**: Local regulations, resources, and cultural factors
- **Strategic Depth**: Questions designed to uncover root causes and constraints
- **Ethical Framework**: Built-in ethical considerations for responsible technology recommendations

## Ethical Considerations Framework

### Built-in Ethical Analysis
The enhanced analysis mode includes comprehensive ethical considerations to ensure responsible technology recommendations for nonprofit organizations. This addresses the unique ethical responsibilities nonprofits face in serving vulnerable populations and managing sensitive data.

### Key Ethical Areas Addressed

#### 🔒 **Data Privacy and Confidentiality**
- Donor information protection and GDPR compliance
- Client data security for vulnerable populations
- Volunteer personal information management
- Third-party data sharing policies

#### ♿ **Digital Accessibility and Equity**
- Ensuring technology serves diverse populations
- Accessibility compliance (WCAG 2.1 AA standards)
- Language and cultural barriers consideration
- Economic accessibility for low-income clients

#### 🤝 **Vendor Ethics and Social Responsibility**
- Evaluating technology vendors' social impact
- Assessing corporate responsibility practices
- Considering vendors' treatment of workers
- Environmental impact of technology choices

#### 🌍 **Transparency and Accountability**
- Open decision-making processes for technology adoption
- Clear communication with stakeholders about technology changes
- Board oversight of technology investments
- Public accountability for technology outcomes

#### 🎯 **Mission Alignment**
- Ensuring technology supports, not detracts from, core mission
- Avoiding technology that could compromise organizational values
- Maintaining focus on beneficiary needs over efficiency gains
- Balancing innovation with stability for vulnerable populations

### Implementation in Enhanced Analysis
The AI automatically evaluates and provides guidance on these ethical considerations as part of every enhanced analysis, ensuring nonprofits receive holistic technology recommendations that align with their values and responsibilities.

## Technical Implementation

### Architecture Components
```
src/
├── app.py              # Flask application setup
├── main.py             # Application entry point  
├── models.py           # Database models
├── routes/             # API endpoint handlers
├── services/           # Business logic and AI integration
└── utils/             # Validation and helper functions
```

### Key Features
1. **Organization Abbreviation Engine**: Intelligent organization name processing
2. **Context-Aware AI Integration**: GPT-4o with nonprofit-specific prompting
3. **Progressive Session Management**: Multi-step questioning workflow
4. **Robust Error Handling**: Comprehensive validation and error responses

### Database Design
- **ProblemAnalysis**: Core problem and analysis storage
- **TechRecommendation**: Solution recommendations with implementation steps
- **Session Management**: Interactive questioning state (in-memory for development)

## Future Enhancements

1. **Persistent Session Storage**: Database-backed session management
2. **Sector-Specific Templates**: Specialized questioning for different nonprofit types
3. **Integration APIs**: Direct connections to nonprofit management platforms
4. **Impact Tracking**: Long-term success measurement and optimization
5. **Multi-Stakeholder Sessions**: Collaborative input during questioning process

## License

This project is built for Tech To The Rescue as part of the AI Enablement Lead recruitment process and has MIT Licence. 