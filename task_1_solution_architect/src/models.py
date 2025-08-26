from app import db
from datetime import datetime
import uuid

class ProblemAnalysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    problem_id = db.Column(db.String(64), unique=True, nullable=False)
    problem_statement = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    clarifying_questions = db.Column(db.JSON)
    analysis_mode = db.Column(db.String(20), default='basic')  # 'basic' or 'enhanced'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'problem_id': self.problem_id,
            'description': self.description,
            'clarifying_questions': self.clarifying_questions or [],
            'analysis_mode': self.analysis_mode,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class TechRecommendation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    problem_id = db.Column(db.String(64), db.ForeignKey('problem_analysis.problem_id'), nullable=False)
    solution_summary = db.Column(db.Text)
    recommended_tech_stack = db.Column(db.JSON)
    initial_steps = db.Column(db.JSON)
    analysis_mode = db.Column(db.String(20), default='basic')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    problem = db.relationship('ProblemAnalysis', backref=db.backref('recommendations', lazy=True))

    def to_dict(self):
        return {
            'solution_summary': self.solution_summary,
            'recommended_tech_stack': self.recommended_tech_stack or [],
            'initial_steps': self.initial_steps or [],
            'analysis_mode': self.analysis_mode,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
