# Project Summary

This repository contains two complementary projects that help nonprofits move from **readiness → action** in their AI and digital transformation journey.

- **Task 1 — AI Architect for Nonprofit Solutions (Flask API)**: An AI-powered API that analyzes a nonprofit’s problem statement and generates context-aware recommendations.
- **Task 2 — AI & Digital Transformation Readiness Assessment (Full‑stack Web App)**: A self‑assessment tool that measures organizational readiness across key dimensions and produces AI‑generated insights and next steps.

---

## How They Fit Together

1. **Assess (Task 2):** Establish a clear baseline of digital/AI readiness and prioritize focus areas.
2. **Act (Task 1):** For high‑priority pain points, generate tailored solution designs and practical first steps.

This pairing enables nonprofits to make informed, staged investments and demonstrate impact quickly.

---

## Task 1 — AI Architect for Nonprofit Solutions (Flask API)

### Purpose
Provide nonprofits with fast, tailored, and implementable technology recommendations based on a plain‑language problem statement. Supports both a spec‑compliant “simple” flow and a deeper, context‑aware “enhanced” flow.

### Key Capabilities
- **Two Analysis Modes**
  - **Simple Analysis** — One‑shot problem→solution with clarifying questions (exact spec compliance).
  - **Enhanced Analysis** — Interactive Q&A that incorporates **organization name**, **geographic location**, and a **5‑part structured problem statement** (“we are / trying to / but / because / which makes us feel”).  
- **Context‑Aware Questioning** — Questions reference the org and location; account for local regulations, resources, and culture.
- **Organization‑Aware Problem IDs** — IDs include an org abbreviation (e.g., `IPCCF3CA48`) for easy tracking.
- **Actionable Output** — Solution summary, recommended tech stack, and initial steps.

### API Surface (selected)
- `POST /analyze` → `{ problem_id, description, clarifying_questions[] }`
- `POST /recommend` → `{ solution_summary, recommended_tech_stack[], initial_steps[] }`
- `POST /analyze/interactive` → starts enhanced session; returns first strategic question
- `POST /analyze/interactive/continue` → continue Q&A
- `POST /analyze/interactive/complete` → final recommendations

### Tech Highlights
- **Stack:** Python 3.8+, **Flask**, **Flask‑SQLAlchemy/SQLAlchemy**, **OpenAI (GPT‑4/4o)**, **Gunicorn**, **Werkzeug**.
- **Architecture:** Modular routes/services/models; robust validation; in‑memory session state for dev.
- **Prompting:** Org‑ and location‑aware templates produce strategic, relevant questions and recommendations.

### Demo Artifacts (examples)
- `1_simple_analysis/food_bank_inventory.json` — real API response demo
- `1_simple_analysis/animal_shelter_management.json` — example with empty clarifying questions
- `2_enhanced_analysis/community_center_interactive.json` — org‑context demo with ID `IPCCF3CA48`
- `2_enhanced_analysis/structured_problem_development.json` — 5‑step problem framework
- `2_enhanced_analysis/organization_abbreviation_examples.json` — ID examples

### Known Limitations & Next Steps
- **Sessions:** In‑memory storage (dev) → recommend DB or Redis for production.
- **Analytics:** Add outcome tracking and CRM integrations.
- **Localization:** Add multi‑language support and regional templates.

---

## Task 2 — AI & Digital Transformation Readiness Assessment (Full‑stack Web)

### Purpose
Enable nonprofits to self‑evaluate readiness for AI/digital transformation across six dimensions, get a weighted score and level, and receive AI‑generated insights and prioritized recommendations.

### Assessment Scope
- **Six Categories (18 questions total):**  
  Strategy & Leadership · People & Culture · Technology & Infrastructure · Data & Analytics · Processes & Governance · Resources & Partnerships
- **Outcomes:** Overall readiness score (0–100%), readiness level (4 tiers), category scores, AI insights, prioritized recommendations, export (PDF/Markdown), and simple visuals.

### Scoring Methodology (as documented)
- **Question scale:** 0–10 per question.
- **Category weights:** Technology & Infrastructure (25), Strategy & Leadership (20), People & Culture (20), Data & Analytics (20), Resources & Partnerships (20), Processes & Governance (15).  
  *Weights are configurable in code; see `FRAMEWORK.md` for methodology and rationale.*
- **Readiness Levels:** Needs Foundation (0–30), Emerging (31–60), Developing (61–85), Advanced (86–100).

### Tech Highlights
- **Frontend:** **React 18 + TypeScript**, **Tailwind CSS**, **Radix UI** (modern, accessible UI with progress tracking).
- **Backend:** **Node.js + Express (TypeScript)**; AI integration via **OpenAI GPT‑4**.
- **Database/ORM:** **PostgreSQL (Neon)** with **Drizzle ORM**; type‑safe schema and migrations.
- **Build/Dev:** **Vite** (FE), **TSX** (BE).  
- **API (selected):**  
  `GET /api/survey-config` · `POST /api/assessments` · `GET /api/assessments/:id` · `GET /api/assessments/:id/report`

### Project Structure (high level)
```
task_2_readiness_survey/
├─ src/
│  ├─ client/ (React app: components, pages, lib, App.tsx, index.html)
│  ├─ server/ (routes.ts, openai-service.ts, storage.ts, index.ts)
│  └─ shared/ (schema.ts)
├─ example_reports/
│  └─ sample_assessment_report.md
├─ FRAMEWORK.md
└─ README.md
```

### Deployment Options
- **Replit** (built‑in deploy), **Vercel/Netlify** (frontend), **Heroku/Railway** (backend), or **Docker**.

### Known Limitations & Next Steps
- **Weights/Questions:** Periodic calibration with domain experts; expand sector‑specific variants.
- **Data Policy:** Add explicit retention settings and admin tools for export/delete.
- **Multi‑tenant:** Add org accounts, auth, and role‑based access if used at scale.

---

## Ethics & Governance (Both Projects)
- **Transparency:** Clear disclosure when AI is used and how outputs are generated.
- **Data Minimization:** Collect only what’s needed; avoid sensitive PII.
- **Bias Awareness:** Prompts emphasize affordable, context‑appropriate options; geographic grounding to reduce one‑size‑fits‑all bias.
- **Compliance:** Encourage secure data handling and local regulatory alignment.

## Licenses
- **Task 1:** MIT (as documented).
- **Task 2:** For educational/nonprofit use (as documented).

## Where to Go Next
- See `/task_1_solution_architect/README.md` and `/task_2_readiness_survey/README.md` for setup and deeper technical details.
- For methodology, consult `FRAMEWORK.md` in Task 2.
