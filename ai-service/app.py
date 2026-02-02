"""
NEXUS AI - Career Guidance Backend Service
Flask application serving AI-powered career recommendations
Endpoints coordinate with Mistral API through agent modules
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from typing import Dict, Any
import os

# Import all agents
from agents.career_agent import analyze_career
from agents.resume_agent import analyze_resume
from agents.interview_agent import generate_interview_prep
from agents.roadmap_agent import generate_learning_roadmap

# Import blueprint routes
from routes.roadmapRoutes import register_roadmap_routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5174", "http://localhost:3000"]}})

# Register roadmap blueprint
register_roadmap_routes(app)

# Health check endpoint
@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "NEXUS AI Career Guidance Service",
        "version": "1.0.0"
    }), 200

# Career Guidance Endpoint
@app.route('/career-guidance', methods=['POST'])
def career_guidance():
    """
    Generate career guidance recommendations
    
    Request body:
    {
        "skills": ["Python", "React", ...],
        "interests": ["Technology", ...],
        "academics": "B.Tech Computer Science",
        "goals": "Want to build AI solutions"
    }
    
    Response:
    {
        "success": true,
        "data": {
            "career": "Job Title",
            "confidence": 85,
            "reason": "Detailed explanation...",
            "priority_skills": ["Skill1", "Skill2", "Skill3"],
            "actions": ["Action 1: Description", "Action 2: Description"]
        }
    }
    """
    try:
        data = request.get_json()
        logger.info(f"Career guidance request received: {data}")
        
        # Validate input
        if not data or not isinstance(data, dict):
            return jsonify({
                "success": False,
                "error": "Invalid request body"
            }), 400
        
        # Call career agent
        result = analyze_career(data)
        
        logger.info(f"Career guidance generated successfully")
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error in career guidance: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Resume Analysis Endpoint
@app.route('/resume-analysis', methods=['POST'])
def resume_analysis():
    """
    Analyze resume and provide improvement suggestions
    
    Request body:
    {
        "resume_text": "Full resume content...",
        "target_career": "Software Engineer"
    }
    
    Response:
    {
        "success": true,
        "data": {
            "strengths": ["Strength 1", "Strength 2"],
            "weaknesses": ["Area 1", "Area 2"],
            "missing_skills": ["Skill 1", "Skill 2"],
            "suggestions": ["Suggestion 1", "Suggestion 2"]
        }
    }
    """
    try:
        data = request.get_json()
        logger.info("Resume analysis request received")
        
        # Validate input
        if not data or 'resume_text' not in data or 'target_career' not in data:
            return jsonify({
                "success": False,
                "error": "Missing resume_text or target_career"
            }), 400
        
        # Call resume agent
        result = analyze_resume(
            resume_text=data['resume_text'],
            target_career=data['target_career']
        )
        
        logger.info("Resume analysis completed successfully")
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error in resume analysis: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Interview Preparation Endpoint
@app.route('/interview-prep', methods=['POST'])
def interview_prep():
    """
    Generate interview preparation content
    
    Request body:
    {
        "career": "Software Engineer",
        "skill_gaps": ["System Design", "AWS"]
    }
    
    Response:
    {
        "success": true,
        "data": {
            "questions": [
                {
                    "question": "Question text",
                    "category": "technical|behavioral|system-design",
                    "sample_answer": "Detailed answer"
                }
            ],
            "tips": ["Tip 1", "Tip 2", ...]
        }
    }
    """
    try:
        data = request.get_json()
        logger.info("Interview preparation request received")
        
        # Validate input
        if not data or 'career' not in data:
            return jsonify({
                "success": False,
                "error": "Missing career field"
            }), 400
        
        skill_gaps = data.get('skill_gaps', [])
        
        # Call interview agent
        result = generate_interview_prep(
            career=data['career'],
            skill_gaps=skill_gaps
        )
        
        logger.info("Interview preparation generated successfully")
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error in interview prep: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Learning Roadmap Endpoint
@app.route('/learning-roadmap', methods=['POST'])
def learning_roadmap():
    """
    Generate personalized learning roadmap
    
    Request body:
    {
        "career": "Software Engineer",
        "skill_gaps": ["System Design", "AWS", "Kubernetes"]
    }
    
    Response:
    {
        "success": true,
        "data": {
            "short_term": [
                {
                    "goal": "Goal description",
                    "duration": "2-3 weeks",
                    "resources": ["Resource 1", "Resource 2"],
                    "projects": ["Project idea"]
                }
            ],
            "medium_term": [
                {
                    "goal": "Goal description",
                    "duration": "1-2 months",
                    "resources": ["Resource 1", "Resource 2"],
                    "projects": ["Project idea"]
                }
            ]
        }
    }
    """
    try:
        data = request.get_json()
        logger.info("Learning roadmap request received")
        
        # Validate input
        if not data or 'career' not in data:
            return jsonify({
                "success": False,
                "error": "Missing career field"
            }), 400
        
        skill_gaps = data.get('skill_gaps', [])
        
        # Call roadmap agent
        result = generate_learning_roadmap(
            career=data['career'],
            skill_gaps=skill_gaps
        )
        
        logger.info("Learning roadmap generated successfully")
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error in learning roadmap: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Combined Career Report Endpoint
@app.route('/career-report', methods=['POST'])
def career_report():
    """
    Generate comprehensive career report combining all analyses
    
    Request body:
    {
        "skills": ["Python", "React", ...],
        "interests": ["Technology", ...],
        "academics": "B.Tech Computer Science",
        "goals": "Want to build AI solutions",
        "resume_text": "Full resume...",
        "skill_gaps": ["System Design", "AWS"]
    }
    
    Response:
    {
        "success": true,
        "data": {
            "career_guidance": {...},
            "resume_analysis": {...},
            "interview_prep": {...},
            "learning_roadmap": {...},
            "report_date": "2024-01-15"
        }
    }
    """
    try:
        data = request.get_json()
        logger.info("Career report request received")
        
        # Validate input
        if not data or 'skills' not in data:
            return jsonify({
                "success": False,
                "error": "Missing required fields"
            }), 400
        
        # Extract data
        skills = data.get('skills', [])
        interests = data.get('interests', [])
        academics = data.get('academics', '')
        goals = data.get('goals', '')
        resume_text = data.get('resume_text', '')
        skill_gaps = data.get('skill_gaps', [])
        
        # Generate all components
        career_guidance = analyze_career({
            "skills": skills,
            "interests": interests,
            "academics": academics,
            "goals": goals
        })
        
        resume_analysis = None
        if resume_text:
            career_from_guidance = career_guidance.get('data', {}).get('career', 'Software Engineer')
            resume_analysis = analyze_resume(
                resume_text=resume_text,
                target_career=career_from_guidance
            )
        
        interview_prep = generate_interview_prep(
            career=career_guidance.get('data', {}).get('career', 'Software Engineer'),
            skill_gaps=skill_gaps
        )
        
        learning_roadmap = generate_learning_roadmap(
            career=career_guidance.get('data', {}).get('career', 'Software Engineer'),
            skill_gaps=skill_gaps
        )
        
        from datetime import datetime
        
        result = {
            "success": True,
            "data": {
                "career_guidance": career_guidance.get('data'),
                "resume_analysis": resume_analysis.get('data') if resume_analysis else None,
                "interview_prep": interview_prep.get('data'),
                "learning_roadmap": learning_roadmap.get('data'),
                "report_date": datetime.now().isoformat()
            }
        }
        
        logger.info("Career report generated successfully")
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error generating career report: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        "success": False,
        "error": "Endpoint not found"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        "success": False,
        "error": "Internal server error"
    }), 500

if __name__ == '__main__':
    logger.info("Starting NEXUS AI Career Guidance Service")
    logger.info(f"Mistral API Key configured: {bool(os.getenv('MISTRAL_API_KEY'))}")
    
    # Run Flask app
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=False,
        threaded=True
    )
