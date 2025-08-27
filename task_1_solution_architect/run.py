#!/usr/bin/env python
"""
Main entry point for the AI Architect for Nonprofit Solutions API
Run this file from the task_1_solution_architect directory
"""

import sys
import os

# Add src directory to path so imports work correctly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from app import app

if __name__ == '__main__':
    print("Starting AI Architect for Nonprofit Solutions API...")
    print("Make sure you have set OPENAI_API_KEY in your environment or .env file")
    print("Server will be available at http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)