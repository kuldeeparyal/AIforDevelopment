# AI Architect for Nonprofit Solutions — Task 1

**Built for Tech To The Rescue — AI Enablement Lead Position**

An **AI-first Flask API** that analyzes nonprofit problem statements and generates tailored **AI-driven recommendations**.  
The system uses **OpenAI’s GPT-5** model (Aug 2025) to produce comprehensive, implementable solutions designed specifically for nonprofits.  

---

## ✨ Features

### 🎯 Two Analysis Approaches
- **Basic Analysis** → Quick problem-to-solution workflow with AI-based recommendations.  
- **Enhanced Interactive Analysis** → Multi-step questioning that incorporates org context and geographic location before generating a final **AI adoption roadmap**.  

### 📍 Context-Aware Questioning
- Problem IDs include **organization abbreviation** (e.g., `Portland Community Center → PCC → IPCC349BAB`).  
- Questions adapt to **local context** (Portland, Oregon → regulations, volunteer ecosystem).  

### 🛡️ Ethical AI Guidance
- Every recommendation includes **ethical considerations**.  
- Covers privacy, AI fairness, accessibility, digital inclusion, and vendor responsibility.  

---

## ⚡ Quick Setup Guide

### 1. Prerequisites
- Python **3.8+**
- `pip` package manager
- **OpenAI API Key** with GPT-5 access (set in `.env`)  

### 2. Clone and Navigate
```bash
git clone <your_repo_url>
cd task_1_solution_architect
3. Install Dependencies
bash
Copy
Edit
pip install -r src/requirements.txt
4. Configure Environment Variables
bash
Copy
Edit
cp .env.example .env
# then edit .env:
# OPENAI_API_KEY=your_key_here
# SESSION_SECRET=your_secure_session
5. Run the Server
bash
Copy
Edit
# Option 1: Development
python run.py

# Option 2: Direct from src
cd src && python main.py

# Option 3: Production-like
cd src && gunicorn --bind 0.0.0.0:5000 main:app
🚀 API Endpoints & Usage
🔹 Health Check
bash
Copy
Edit
curl http://localhost:5000/
🔹 Basic Analysis
bash
Copy
Edit
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"problem_statement": "We need better volunteer management"}'
🔹 Recommendations (Basic)
bash
Copy
Edit
curl -X POST http://localhost:5000/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "problem_id": "P3722A25D",
    "description": "Loan officers need better analysis tools",
    "clarifying_questions": []
  }'
🔹 Start Interactive Analysis
bash
Copy
Edit
curl -X POST http://localhost:5000/analyze/interactive \
  -H "Content-Type: application/json" \
  -d '{
    "problem_statement": "We need better volunteer management",
    "organization_name": "Portland Community Center",
    "geographic_location": "Portland, Oregon"
  }'
🔹 Continue Interactive Q&A
bash
Copy
Edit
curl -X POST http://localhost:5000/analyze/interactive/continue \
  -H "Content-Type: application/json" \
  -d '{
    "problem_id": "IPCC349BAB",
    "answer": "We currently use spreadsheets to track volunteers, but scheduling is messy."
  }'
🔹 Complete Interactive Session
bash
Copy
Edit
curl -X POST http://localhost:5000/analyze/interactive/complete \
  -H "Content-Type: application/json" \
  -d '{"problem_id": "IPCC349BAB"}'
📦 Example Outputs
Basic Analysis Response
json
Copy
Edit
{
  "problem_id": "P3722A25D",
  "description": "Loan officers need AI-driven tools to automate analysis and improve decision-making.",
  "clarifying_questions": ["What data sources are available?", "What KPIs should be prioritized?"]
}
Recommendations Response
json
Copy
Edit
{
  "solution_summary": "Introduce an AI-powered decision support system for loan analysis.",
  "recommended_tech_stack": [
    "GPT-5 for text-based risk assessment",
    "Superset for AI-driven dashboards",
    "LangChain for data integration"
  ],
  "initial_steps": [
    "Collect and clean historical loan data",
    "Deploy AI-powered BI dashboards",
    "Integrate GPT-5 for case analysis summaries"
  ]
}
Interactive Complete Response
json
Copy
Edit
{
  "analysis_summary": "Manual volunteer scheduling creates inefficiency and confusion.",
  "solution_summary": "Adopt an AI scheduling assistant with automated reminders and volunteer matching.",
  "recommended_tech_stack": [
    "GPT-5 conversational assistant for volunteer engagement",
    "AI-powered scheduling (e.g., Rasa + Calendar API)",
    "Supabase/Postgres for structured volunteer data"
  ],
  "initial_steps": [
    "Migrate volunteer data from spreadsheets",
    "Deploy AI scheduling tool with SMS/email reminders",
    "Pilot with 20 volunteers before scaling"
  ],
  "success_metrics": ["Reduction in missed shifts", "Volunteer satisfaction increase"],
  "risk_mitigation": ["Bias in scheduling — keep human override", "Training volunteers on new tools"],
  "ethical_considerations": ["Privacy of volunteer contact info", "Accessibility for non-digital volunteers"]
}
🛠 Troubleshooting
No session found → Ensure you reuse the same problem_id across /interactive/continue and /interactive/complete.

API Key errors → Verify .env has a valid OPENAI_API_KEY.

Port already in use → Change port:

bash
Copy
Edit
gunicorn --bind 0.0.0.0:5050 main:app
📌 What's Included
Flask API app (src/)

Two analysis modes (basic, enhanced interactive)

AI-first recommendations (GPT-5)

Ethical considerations framework

Demo JSON cases in demo_cases/

📜 License
MIT License — built for Tech To The Rescue as part of the AI Enablement Lead recruitment process.