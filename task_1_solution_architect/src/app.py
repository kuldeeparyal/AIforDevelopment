import os
import logging
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix

# Load environment variables from env file before anything else
import load_env

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Import db from models to avoid circular import
from models import db

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///nonprofit_ai.db")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Initialize the app with the extension
db.init_app(app)

with app.app_context():
    # Import models to ensure tables are created
    import models  # noqa: F401
    db.create_all()

# Register blueprints
from routes.analyze import analyze_bp
from routes.recommend import recommend_bp
from routes.interactive_questioning import questioning_bp
from routes.problem_structuring import structuring_bp

app.register_blueprint(analyze_bp)
app.register_blueprint(recommend_bp)
app.register_blueprint(questioning_bp)
app.register_blueprint(structuring_bp)

@app.route('/')
def index():
    return {
        "message": "AI Architect for Nonprofit Solutions API",
        "version": "1.0.0",
        "endpoints": {
            "analyze": {
                "method": "POST",
                "url": "/analyze",
                "description": "Analyze nonprofit problem statements (basic/enhanced)"
            },
            "analyze_interactive": {
                "method": "POST",
                "url": "/analyze/interactive",
                "description": "Start interactive questioning session (enhanced mode)"
            },
            "continue_interactive": {
                "method": "POST",
                "url": "/analyze/interactive/continue",
                "description": "Continue interactive questioning with answer"
            },
            "complete_interactive": {
                "method": "POST",
                "url": "/analyze/interactive/complete",
                "description": "Complete analysis with comprehensive solution"
            },
            "recommend": {
                "method": "POST", 
                "url": "/recommend",
                "description": "Generate technical recommendations"
            },
            "structure_problem_start": {
                "method": "POST",
                "url": "/problem/structure/start",
                "description": "Start guided problem statement structuring"
            },
            "structure_problem_continue": {
                "method": "POST",
                "url": "/problem/structure/continue",
                "description": "Continue structured problem development"
            },
            "structure_problem_complete": {
                "method": "POST",
                "url": "/problem/structure/complete",
                "description": "Generate final structured problem statement"
            }
        }
    }

@app.errorhandler(404)
def not_found(error):
    return {"error": "Endpoint not found", "message": "Please check the API documentation for valid endpoints."}, 404

@app.errorhandler(500)
def internal_error(error):
    return {"error": "Internal server error", "message": "An unexpected error occurred. Please try again."}, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
