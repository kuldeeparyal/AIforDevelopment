import os
import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

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

app.register_blueprint(analyze_bp)
app.register_blueprint(recommend_bp)

@app.route('/')
def index():
    return {
        "message": "AI Architect for Nonprofit Solutions API",
        "version": "1.0.0",
        "endpoints": {
            "analyze": {
                "method": "POST",
                "url": "/analyze",
                "description": "Analyze nonprofit problem statements"
            },
            "recommend": {
                "method": "POST", 
                "url": "/recommend",
                "description": "Generate technical recommendations"
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
