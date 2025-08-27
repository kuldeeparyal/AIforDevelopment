# AI Solutions for Nonprofits — Unified Overview

This repository contains **two complementary projects** that help nonprofits move from **readiness → action** in their AI and digital transformation journey.

- **Task 1 — AI Architect for Nonprofit Solutions (Flask API)**  
  An AI-powered API that analyses a nonprofit’s problem statement and generates **context-aware** recommendations with practical first steps.
- **Task 2 — AI & Digital Transformation Readiness Assessment (Full‑stack Web App)**  
A self-assessment that measures organisational readiness across six survey categories 
(consolidated into five scoring dimensions) and produces AI-generated insights

> For a narrative comparison of both projects, see **[Project_Summary.md](./Project_Summary.md)**.

---

## When to Use Which
- **Start with Task 2 (Assess):** Establish your readiness baseline and identify priority gaps.  
- **Then use Task 1 (Act):** For each high‑priority pain point, generate tailored solution designs and an actionable starting plan.

Together they form a pragmatic **assess → act** pipeline for digital transformation.

---

## Repository Structure

```
/task_1_solution_architect/   # Flask API: analyze → recommend
/task_2_readiness_survey/     # Full-stack readiness assessment
/Project_Summary.md           # Repo-level summary of both tasks
/README.md                    # (this file)
```

---

## Quick Start

### Task 1 — AI Architect (Flask API)
**Prerequisites**
- Python 3.8+
- OpenAI API key (GPT‑4/4o access)
- (Optional) `gunicorn` for production runs

**Setup**
```bash
cd task_1_solution_architect
cp .env.example .env   # add OPENAI_API_KEY and SESSION_SECRET
pip install -r src/requirements.txt

# Development
cd src && python main.py

# Or production-like
gunicorn --bind 0.0.0.0:5000 --reuse-port --reload main:app
```

**Usage**
- Base URL: `http://localhost:5000`
- Health: `GET /`
- Core endpoints:
  - `POST /analyze` → `{ problem_id, description, clarifying_questions[] }`
  - `POST /recommend` → `{ solution_summary, recommended_tech_stack[], initial_steps[] }`
  - `POST /analyze/interactive` → start enhanced session
  - `POST /analyze/interactive/continue` → continue Q&A
  - `POST /analyze/interactive/complete` → final recommendations

> Details, demo cases, and design notes: **task_1_solution_architect/README.md**

---

### Task 2 — Readiness Assessment (Full‑stack Web)
**Prerequisites**
- Node.js 18+
- PostgreSQL (e.g., Neon) connection string
- OpenAI API key

**Setup**
```bash
cd task_2_readiness_survey
cp .env.example .env   # add OPENAI_API_KEY and DB connection string
npm install
npm run db:push
npm run dev
```
- App URL (dev): `http://localhost:5000`

**Key APIs**
- `GET /api/survey-config` — survey metadata
- `POST /api/assessments` — submit responses
- `GET /api/assessments/:id` — fetch results
- `GET /api/assessments/:id/report` — export assessment as Markdown
  
> Methodology and scoring: **task_2_readiness_survey/FRAMEWORK.md**  
> Sample output: **task_2_readiness_survey/example_reports/sample_assessment_report.md**

---

## Design Principles (Both Projects)
- **Practical & Actionable** — Outputs focus on concrete next steps and tools.
- **Context‑Aware** — Org name & location (Task 1) and category‑weighted scoring (Task 2).
- **Ethical by Design** — Data minimization, transparency on AI use, bias‑aware prompting.
- **Extensible** — Pluggable LLMs/tools; configurable questions/weights; modular services.

## Roadmap Highlights
- **Task 1:** Persistent/redis sessions, sector‑specific playbooks, CRM/impact tracking.
- **Task 2:** Multi‑tenant org accounts, retention settings & admin export/delete, sector variants & localized content.

## Contributing
1. Fork the repo and create a feature branch.  
2. Follow the language stack conventions in each task.  
3. Submit a PR with a brief description and screenshots or sample outputs where relevant.

## License
- **Task 1 and Task 2:** MIT (as documented in the task directory).  

---

**Questions?** See the task‑level READMEs or open an issue. For a concise, side‑by‑side view tailored to evaluators, download the **Concise Summary** provided separately.
