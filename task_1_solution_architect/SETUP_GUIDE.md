# Quick Setup Guide for AI Architect for Nonprofit Solutions

## Installation Steps

1. **Prerequisites**
   - Python 3.8 or higher
   - pip package manager
   - OpenAI API key with GPT-4o access

2. **Clone/Download the Repository**
   ```bash
   # After downloading/cloning, navigate to the folder
   cd task_1_solution_architect
   ```

3. **Install Dependencies**
   ```bash
   pip install -r src/requirements.txt
   ```

4. **Configure Environment Variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your OpenAI API key:
   # OPENAI_API_KEY=your_actual_openai_api_key_here
   # SESSION_SECRET=your_secure_session_secret_here
   ```

5. **Run the Server**
   ```bash
   # Option 1: Simple development run
   python run.py
   
   # Option 2: Production with gunicorn
   cd src && gunicorn --bind 0.0.0.0:5000 main:app
   
   # Option 3: Direct from src
   cd src && python main.py
   ```

6. **Test the API**
   ```bash
   # Health check
   curl http://localhost:5000/
   
   # Basic analysis
   curl -X POST http://localhost:5000/analyze \
     -H "Content-Type: application/json" \
     -d '{"problem_statement": "We need better volunteer management"}'
   ```

## Troubleshooting

- **Import Errors**: Make sure you're running from the correct directory
- **API Key Issues**: Verify OPENAI_API_KEY is set correctly in .env
- **Port Already in Use**: Change port 5000 to another port in run.py/main.py
- **Database Issues**: The SQLite database will be created automatically on first run

## What's Included

- Complete Flask API application
- Two analysis modes (basic and enhanced)
- Interactive questioning system
- Ethical considerations framework
- Demo JSON files in `demo_cases/` folder
- Full documentation in README.md