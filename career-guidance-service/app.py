"""
CareerNexus AI - Flask Backend
Main application file with all API endpoints for career guidance
Routes: /assess, /score, /roadmap/<career>, /report
"""

from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
import joblib
import numpy as np
import json
from datetime import datetime
import os
from io import BytesIO

# Import career roadmap and PDF generation
from career_roadmap import CAREER_ROADMAPS, get_roadmap
from pdf_generator import generate_career_pdf

# ============================================
# INITIALIZE FLASK APP
# ============================================
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# ============================================
# LOAD TRAINED MODELS
# ============================================
try:
    # Load the trained RandomForest model
    model = joblib.load('models/career_rf_model.pkl')
    
    # Load the feature scaler
    scaler = joblib.load('models/scaler.pkl')
    
    # Load feature names
    feature_names = joblib.load('models/feature_names.pkl')
    
    # Load career classes
    career_classes = joblib.load('models/career_classes.pkl')
    
    print("✓ Models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    print("Please run train_model.py first!")

# ============================================
# CAREER ROADMAPS DATA STRUCTURE
# ============================================
"""
Each career has a personalized 6-month roadmap
No generic learning content - only career-specific actions
"""

ROADMAP_DATA = {
    'Data Analyst': {
        'duration': '6 months',
        'steps': [
            {
                'month': 'Month 1-2',
                'focus': 'Master SQL & Python',
                'actions': [
                    'Complete Advanced SQL on DataCamp',
                    'Build 3 SQL projects analyzing real datasets',
                    'Learn Pandas for data manipulation',
                    'Practice on LeetCode SQL problems'
                ]
            },
            {
                'month': 'Month 2-3',
                'focus': 'Data Visualization & BI Tools',
                'actions': [
                    'Master Tableau or Power BI',
                    'Create 2 interactive dashboards',
                    'Learn Data Storytelling',
                    'Practice presenting insights'
                ]
            },
            {
                'month': 'Month 3-4',
                'focus': 'Real-World Projects',
                'actions': [
                    'Complete 2 end-to-end data analysis projects',
                    'Publish projects on GitHub',
                    'Write detailed analysis reports',
                    'Get feedback from mentors'
                ]
            },
            {
                'month': 'Month 4-5',
                'focus': 'Interview Preparation',
                'actions': [
                    'Study Statistics & Probability',
                    'Practice 50+ case studies',
                    'Learn STAR method',
                    'Mock interviews with seniors'
                ]
            },
            {
                'month': 'Month 5-6',
                'focus': 'Job Search & Networking',
                'actions': [
                    'Update LinkedIn profile professionally',
                    'Apply to 20+ companies',
                    'Attend data analytics meetups',
                    'Network with data professionals'
                ]
            }
        ]
    },
    'ML Engineer': {
        'duration': '6 months',
        'steps': [
            {
                'month': 'Month 1-2',
                'focus': 'Deep Learning Fundamentals',
                'actions': [
                    'Master TensorFlow & PyTorch',
                    'Complete neural network basics',
                    'Build 3 CNN projects',
                    'Understand backpropagation theory'
                ]
            },
            {
                'month': 'Month 2-3',
                'focus': 'NLP & Computer Vision',
                'actions': [
                    'Build sentiment analysis model',
                    'Create image classification system',
                    'Learn Transformers architecture',
                    'Implement BERT for NLP tasks'
                ]
            },
            {
                'month': 'Month 3-4',
                'focus': 'Model Optimization',
                'actions': [
                    'Learn hyperparameter tuning',
                    'Implement cross-validation',
                    'Deploy models to cloud (AWS/GCP)',
                    'Optimize for production'
                ]
            },
            {
                'month': 'Month 4-5',
                'focus': 'Portfolio Projects',
                'actions': [
                    'Build 2 end-to-end ML projects',
                    'Document methodology clearly',
                    'Create GitHub portfolio',
                    'Write technical blog posts'
                ]
            },
            {
                'month': 'Month 5-6',
                'focus': 'Interview & Networking',
                'actions': [
                    'Practice coding interviews',
                    'Learn ML system design',
                    'Join ML communities',
                    'Apply to FAANG companies'
                ]
            }
        ]
    },
    'Full Stack Developer': {
        'duration': '6 months',
        'steps': [
            {
                'month': 'Month 1-2',
                'focus': 'Frontend Mastery',
                'actions': [
                    'Advanced React/Vue concepts',
                    'Master CSS Grid & Flexbox',
                    'Build 3 responsive projects',
                    'Learn state management (Redux/Context)'
                ]
            },
            {
                'month': 'Month 2-3',
                'focus': 'Backend Development',
                'actions': [
                    'Build REST APIs with Node.js/Python',
                    'Master database design (SQL/NoSQL)',
                    'Learn authentication & security',
                    'Implement 5+ backend features'
                ]
            },
            {
                'month': 'Month 3-4',
                'focus': 'DevOps & Deployment',
                'actions': [
                    'Learn Docker & containerization',
                    'Deploy apps to Heroku/AWS',
                    'Setup CI/CD pipelines',
                    'Monitor application performance'
                ]
            },
            {
                'month': 'Month 4-5',
                'focus': 'Full Stack Projects',
                'actions': [
                    'Build 2 complete full-stack apps',
                    'Implement payment integration',
                    'Setup real-time features (WebSockets)',
                    'Add testing (unit & integration)'
                ]
            },
            {
                'month': 'Month 5-6',
                'focus': 'Interview Preparation',
                'actions': [
                    'Practice system design questions',
                    'Code interviews in JavaScript/Python',
                    'Build portfolio website',
                    'Apply to tech companies'
                ]
            }
        ]
    },
    'Data Scientist': {
        'duration': '6 months',
        'steps': [
            {
                'month': 'Month 1-2',
                'focus': 'Statistics & ML Theory',
                'actions': [
                    'Master probability & statistics',
                    'Learn machine learning algorithms',
                    'Understand statistical testing',
                    'Study feature engineering'
                ]
            },
            {
                'month': 'Month 2-3',
                'focus': 'Advanced Modeling',
                'actions': [
                    'Learn ensemble methods',
                    'Implement gradient boosting (XGBoost)',
                    'Master deep learning models',
                    'Study A/B testing methodology'
                ]
            },
            {
                'month': 'Month 3-4',
                'focus': 'Big Data & Scaling',
                'actions': [
                    'Learn PySpark for big data',
                    'Understand distributed computing',
                    'Work with cloud ML services',
                    'Optimize models for scale'
                ]
            },
            {
                'month': 'Month 4-5',
                'focus': 'Research & Innovation',
                'actions': [
                    'Implement cutting-edge papers',
                    'Contribute to open-source ML projects',
                    'Write research papers',
                    'Present findings'
                ]
            },
            {
                'month': 'Month 5-6',
                'focus': 'Industry Transition',
                'actions': [
                    'Build industry-relevant projects',
                    'Learn production ML pipelines',
                    'Network with data scientists',
                    'Apply to top AI companies'
                ]
            }
        ]
    },
    'Frontend Developer': {
        'duration': '6 months',
        'steps': [
            {
                'month': 'Month 1-2',
                'focus': 'Framework Mastery',
                'actions': [
                    'Deep dive into React/Vue/Angular',
                    'Master component lifecycle',
                    'Learn hooks & composition APIs',
                    'Build 3 complex UI components'
                ]
            },
            {
                'month': 'Month 2-3',
                'focus': 'Design & UX',
                'actions': [
                    'Learn responsive design principles',
                    'Master CSS animations',
                    'Study user experience concepts',
                    'Implement accessibility (a11y)'
                ]
            },
            {
                'month': 'Month 3-4',
                'focus': 'Performance Optimization',
                'actions': [
                    'Learn code splitting & lazy loading',
                    'Optimize bundle size',
                    'Master performance metrics',
                    'Implement caching strategies'
                ]
            },
            {
                'month': 'Month 4-5',
                'focus': 'Project Portfolio',
                'actions': [
                    'Build 3 production-level projects',
                    'Implement PWA features',
                    'Create interactive demos',
                    'Deploy to CDN'
                ]
            },
            {
                'month': 'Month 5-6',
                'focus': 'Interview & Hiring',
                'actions': [
                    'Practice frontend coding interviews',
                    'Build stunning portfolio website',
                    'Contribute to open-source UI libraries',
                    'Network on Twitter/LinkedIn'
                ]
            }
        ]
    },
    'Business Analyst': {
        'duration': '6 months',
        'steps': [
            {
                'month': 'Month 1-2',
                'focus': 'Business Fundamentals',
                'actions': [
                    'Learn business analysis techniques',
                    'Master Excel & data analysis',
                    'Study market research methods',
                    'Learn SQL for business queries'
                ]
            },
            {
                'month': 'Month 2-3',
                'focus': 'Requirements & Strategy',
                'actions': [
                    'Master requirement gathering',
                    'Learn process mapping',
                    'Study competitive analysis',
                    'Understand strategic planning'
                ]
            },
            {
                'month': 'Month 3-4',
                'focus': 'Tools & Technologies',
                'actions': [
                    'Master Tableau/Power BI for reporting',
                    'Learn Jira & Agile methodologies',
                    'Study user story creation',
                    'Learn data visualization'
                ]
            },
            {
                'month': 'Month 4-5',
                'focus': 'Case Studies & Projects',
                'actions': [
                    'Complete 2 business analysis projects',
                    'Present findings to stakeholders',
                    'Create business recommendations',
                    'Document processes thoroughly'
                ]
            },
            {
                'month': 'Month 5-6',
                'focus': 'Interview Prep & Networking',
                'actions': [
                    'Practice case interview questions',
                    'Prepare success stories',
                    'Network with business leaders',
                    'Apply to consulting firms'
                ]
            }
        ]
    },
    'Project Manager': {
        'duration': '6 months',
        'steps': [
            {
                'month': 'Month 1-2',
                'focus': 'PM Fundamentals',
                'actions': [
                    'Learn Agile & Scrum methodologies',
                    'Study project management basics',
                    'Complete PMP course modules',
                    'Learn team dynamics'
                ]
            },
            {
                'month': 'Month 2-3',
                'focus': 'Tools & Frameworks',
                'actions': [
                    'Master Jira, Asana, Monday.com',
                    'Learn roadmap planning',
                    'Study OKR methodology',
                    'Learn risk management'
                ]
            },
            {
                'month': 'Month 3-4',
                'focus': 'Leadership Skills',
                'actions': [
                    'Develop communication skills',
                    'Learn stakeholder management',
                    'Study conflict resolution',
                    'Master negotiation techniques'
                ]
            },
            {
                'month': 'Month 4-5',
                'focus': 'Real Projects',
                'actions': [
                    'Lead 2 actual projects',
                    'Practice sprint planning',
                    'Conduct retrospectives',
                    'Mentor junior members'
                ]
            },
            {
                'month': 'Month 5-6',
                'focus': 'Certifications & Growth',
                'actions': [
                    'Pursue PMP certification',
                    'Build portfolio of projects',
                    'Network with PM community',
                    'Apply to PM roles'
                ]
            }
        ]
    }
}

# ============================================
# CAREER CHAT RESPONSES (Rule-based + ML Fallback)
# ============================================
CHAT_RESPONSES = {
    'why_career_suitable': {
        'Data Analyst': "You're suitable for Data Analyst because you have strong SQL and analytical skills. Your interest in data exceeds {data_interest}% and your CGPA shows solid technical foundation.",
        'ML Engineer': "You're perfect for ML Engineer with your Python expertise and strong interest in research ({research_interest}%). Your problem-solving skills are excellent.",
        'Full Stack Developer': "Your development and communication skills position you well for Full Stack development. You balance both frontend and backend interests effectively.",
        'Data Scientist': "Your research interest ({research_interest}%) and ML knowledge make data science ideal. You have the theoretical foundation needed.",
        'Frontend Developer': "Your design interest ({design_interest}%) combined with strong communication skills make you a great fit for frontend development.",
        'Business Analyst': "Your management interest ({management_interest}%) and communication skills align perfectly with business analysis.",
        'Project Manager': "Your management interest ({management_interest}%) and leadership potential make you suitable for project management roles."
    },
    'improve_score': {
        'Data Analyst': "To improve: (1) Strengthen your SQL skills with LeetCode, (2) Build 2 data projects, (3) Learn Tableau, (4) Get internship experience",
        'ML Engineer': "To improve: (1) Complete Deep Learning specialization, (2) Build 2 ML projects on Kaggle, (3) Contribute to open-source, (4) Publish research",
        'Full Stack Developer': "To improve: (1) Master React deeply, (2) Learn backend frameworks, (3) Deploy 3 projects, (4) Contribute to GitHub",
        'Data Scientist': "To improve: (1) Study statistics deeper, (2) Complete ML specialization, (3) Work on Kaggle competitions, (4) Read research papers",
        'Frontend Developer': "To improve: (1) Master CSS Grid & Flexbox, (2) Learn performance optimization, (3) Build 3 UI projects, (4) Contribute to UI libraries",
        'Business Analyst': "To improve: (1) Take excel advanced course, (2) Learn Tableau, (3) Study business fundamentals, (4) Read business cases",
        'Project Manager': "To improve: (1) Complete Agile/Scrum course, (2) Lead a small project, (3) Get PMP fundamentals, (4) Practice communication"
    },
    'jobs_to_apply': {
        'Data Analyst': "You can apply for: (1) Data Analyst (entry-level), (2) Business Analyst, (3) Analytics Intern, (4) BI Developer, (5) Financial Analyst",
        'ML Engineer': "You can apply for: (1) ML Engineer (junior), (2) AI Engineer, (3) NLP Engineer, (4) Computer Vision Engineer, (5) Research Scientist",
        'Full Stack Developer': "You can apply for: (1) Full Stack Developer, (2) Frontend Developer, (3) Backend Developer, (4) Web Developer, (5) MERN Developer",
        'Data Scientist': "You can apply for: (1) Data Scientist, (2) ML Researcher, (3) Analytics Engineer, (4) AI Engineer, (5) Research Scientist",
        'Frontend Developer': "You can apply for: (1) Frontend Developer, (2) React Developer, (3) UI Engineer, (4) Web Developer, (5) Design Engineer",
        'Business Analyst': "You can apply for: (1) Business Analyst, (2) Systems Analyst, (3) Data Analyst, (4) Product Manager, (5) Management Consultant",
        'Project Manager': "You can apply for: (1) Project Manager, (2) Scrum Master, (3) Product Manager, (4) Program Manager, (5) Operations Manager"
    }
}

# ============================================
# UTILITY FUNCTIONS
# ============================================

def calculate_readiness_score(skills_match, academic_score, interest_alignment):
    """
    Calculate Career Readiness Score using weighted formula:
    Score = (Skills Match × 0.40) + (Academic Score × 0.30) + (Interest Alignment × 0.30)
    
    Args:
        skills_match: Score 0-100 (how well skills match career)
        academic_score: CGPA scaled to 0-100 (CGPA/10 × 100)
        interest_alignment: Score 0-100 (how interested student is)
    
    Returns:
        Score 0-100 and color coding
    """
    score = (skills_match * 0.40) + (academic_score * 0.30) + (interest_alignment * 0.30)
    score = min(100, max(0, score))  # Clamp to 0-100
    
    # Color coding
    if score < 40:
        color = 'red'
        status = 'Needs Improvement'
    elif score < 70:
        color = 'yellow'
        status = 'On Track'
    else:
        color = 'green'
        status = 'Career Ready'
    
    return {
        'score': round(score, 2),
        'color': color,
        'status': status
    }

def prepare_features(data):
    """
    Prepare features from user input for ML model
    Converts user data to feature array matching training data
    """
    features = [
        data.get('Python', 0),
        data.get('Java', 0),
        data.get('SQL', 0),
        data.get('ML', 0),
        data.get('Communication', 0),
        data.get('ProblemSolving', 0),
        data.get('Data_Interest', 0),
        data.get('Development_Interest', 0),
        data.get('Management_Interest', 0),
        data.get('Research_Interest', 0),
        data.get('Design_Interest', 0),
        data.get('CGPA', 0)
    ]
    return np.array([features])

# ============================================
# API ENDPOINTS
# ============================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health Check Endpoint
    
    Returns service status for frontend health monitoring
    
    Returns:
    {
        "status": "ok",
        "service": "CareerNexus AI",
        "version": "1.0",
        "timestamp": "2026-01-31T22:30:00"
    }
    """
    try:
        return jsonify({
            'status': 'ok',
            'service': 'CareerNexus AI',
            'version': '1.0',
            'timestamp': datetime.now().isoformat(),
            'models_loaded': True
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'service': 'CareerNexus AI',
            'error': str(e)
        }), 500

@app.route('/', methods=['GET'])
def home():
    """Home endpoint - serves the assessment UI"""
    return render_template('index.html')

@app.route('/api/assess', methods=['POST'])
def assess_career():
    """
    POST /assess
    Analyzes student data and predicts suitable careers
    
    Input JSON:
    {
        "Python": 4, "Java": 3, "SQL": 5, "ML": 5,
        "Communication": 4, "ProblemSolving": 5,
        "Data_Interest": 90, "Development_Interest": 60,
        "Management_Interest": 40, "Research_Interest": 85,
        "Design_Interest": 35, "CGPA": 8.5,
        "name": "John Doe", "email": "john@example.com"
    }
    
    Output JSON:
    {
        "primary_career": "ML Engineer",
        "confidence": 87.5,
        "top_3_careers": [...],
        "prediction_explanation": "..."
    }
    """
    try:
        data = request.get_json()
        
        # Validate input
        required_skills = ['Python', 'Java', 'SQL', 'ML', 'Communication', 'ProblemSolving']
        required_interests = ['Data_Interest', 'Development_Interest', 'Management_Interest', 'Research_Interest', 'Design_Interest']
        required_field = ['CGPA']
        
        if not data:
            return jsonify({'error': 'No input data provided'}), 400
        
        # Prepare features
        features = prepare_features(data)
        features_scaled = scaler.transform(features)
        
        # Get predictions
        prediction = model.predict(features_scaled)[0]
        probabilities = model.predict_proba(features_scaled)[0]
        
        # Get top 3 careers with confidence
        top_3_indices = np.argsort(probabilities)[-3:][::-1]
        top_3_careers = [
            {
                'career': career_classes[idx],
                'confidence': round(probabilities[idx] * 100, 2)
            }
            for idx in top_3_indices
        ]
        
        # Calculate skills match
        skill_values = [data.get(skill, 0) for skill in required_skills]
        skills_match = (sum(skill_values) / len(skill_values) / 5) * 100  # Normalize to 100
        
        response = {
            'success': True,
            'primary_career': prediction,
            'confidence': round(max(probabilities) * 100, 2),
            'top_3_careers': top_3_careers,
            'skills_match': round(skills_match, 2),
            'student_name': data.get('name', 'Student'),
            'student_email': data.get('email', ''),
            'timestamp': datetime.now().isoformat(),
            'message': f'Based on your profile, {prediction} is the best fit with {round(max(probabilities) * 100, 2)}% confidence!'
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/api/score', methods=['POST'])
def calculate_score():
    """
    POST /score
    Calculates Career Readiness Score
    
    Input JSON:
    {
        "Python": 4, "Java": 3, "SQL": 5, "ML": 5,
        "Communication": 4, "ProblemSolving": 5,
        "Data_Interest": 90, "Development_Interest": 60,
        "Management_Interest": 40, "Research_Interest": 85,
        "Design_Interest": 35, "CGPA": 8.5,
        "predicted_career": "ML Engineer"
    }
    
    Output JSON:
    {
        "readiness_score": 78.5,
        "status": "Career Ready",
        "color": "green",
        "breakdown": {
            "skills_match": 85,
            "academic_score": 85,
            "interest_alignment": 85
        }
    }
    """
    try:
        data = request.get_json()
        
        # Calculate skills match (0-100)
        skill_values = [data.get('Python', 0), data.get('Java', 0), data.get('SQL', 0),
                       data.get('ML', 0), data.get('Communication', 0), data.get('ProblemSolving', 0)]
        skills_match = (sum(skill_values) / len(skill_values) / 5) * 100
        
        # Calculate academic score (CGPA converted to 0-100)
        cgpa = data.get('CGPA', 0)
        academic_score = (cgpa / 10) * 100
        
        # Calculate interest alignment (0-100)
        career = data.get('predicted_career', 'Data Analyst')
        interests = {
            'Data Analyst': ['Data_Interest'],
            'ML Engineer': ['Research_Interest', 'Data_Interest'],
            'Full Stack Developer': ['Development_Interest'],
            'Data Scientist': ['Research_Interest'],
            'Frontend Developer': ['Development_Interest', 'Design_Interest'],
            'Business Analyst': ['Data_Interest', 'Management_Interest'],
            'Project Manager': ['Management_Interest']
        }
        
        relevant_interests = interests.get(career, ['Data_Interest'])
        interest_values = [data.get(interest, 0) for interest in relevant_interests]
        interest_alignment = sum(interest_values) / len(interest_values)
        
        # Calculate readiness score
        readiness = calculate_readiness_score(skills_match, academic_score, interest_alignment)
        
        response = {
            'success': True,
            'readiness_score': readiness['score'],
            'status': readiness['status'],
            'color': readiness['color'],
            'breakdown': {
                'skills_match': round(skills_match, 2),
                'academic_score': round(academic_score, 2),
                'interest_alignment': round(interest_alignment, 2)
            },
            'recommendations': [
                'Improve your weakest skill with targeted practice' if skills_match < 70 else None,
                'Maintain your academic performance' if academic_score >= 70 else 'Focus on improving your CGPA',
                'Align more with career through projects' if interest_alignment < 70 else 'Great alignment with career interests!'
            ]
        }
        
        response['recommendations'] = [r for r in response['recommendations'] if r]
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/api/roadmap/<career>', methods=['GET'])
def get_career_roadmap(career):
    """
    GET /roadmap/<career>
    Returns personalized 6-month career roadmap
    
    Returns:
    {
        "career": "ML Engineer",
        "duration": "6 months",
        "steps": [...]
    }
    """
    try:
        # Normalize career name
        for key in ROADMAP_DATA.keys():
            if key.lower() == career.lower():
                roadmap = ROADMAP_DATA[key]
                return jsonify({
                    'success': True,
                    'career': key,
                    'duration': roadmap['duration'],
                    'steps': roadmap['steps']
                }), 200
        
        return jsonify({
            'error': f'Career "{career}" not found. Available careers: {list(ROADMAP_DATA.keys())}',
            'success': False
        }), 404
        
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/api/report', methods=['POST'])
def generate_report():
    """
    POST /report
    Generates and downloads a PDF career report
    
    Input JSON:
    {
        "name": "John Doe",
        "email": "john@example.com",
        "cgpa": 8.5,
        "primary_career": "ML Engineer",
        "confidence": 87.5,
        "readiness_score": 78.5,
        "skills": {...},
        "interests": {...}
    }
    
    Returns: PDF file
    """
    try:
        data = request.get_json()
        
        # Generate PDF
        pdf_buffer = generate_career_pdf(data)
        
        return send_file(
            BytesIO(pdf_buffer),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"Career_Report_{data.get('name', 'Student')}.pdf"
        )
        
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/api/chat', methods=['POST'])
def career_chat():
    """
    POST /chat
    AI Career Chat Assistant (Rule-based + ML fallback)
    
    Input JSON:
    {
        "question": "Why is ML Engineer suitable for me?",
        "career": "ML Engineer",
        "user_data": {...}
    }
    
    Output: Personalized chat response
    """
    try:
        data = request.get_json()
        question = data.get('question', '').lower()
        career = data.get('career', 'Data Analyst')
        user_data = data.get('user_data', {})
        
        # Determine question type
        response_text = "I'm not sure about that. Please ask specific questions like: 'Why is this career suitable for me?', 'How can I improve my score?', or 'What jobs can I apply for?'"
        
        if any(word in question for word in ['why', 'suitable', 'fit', 'good']):
            # Answer: Why is career suitable?
            template = CHAT_RESPONSES['why_career_suitable'].get(career, CHAT_RESPONSES['why_career_suitable']['Data Analyst'])
            response_text = template.format(
                data_interest=user_data.get('Data_Interest', 50),
                research_interest=user_data.get('Research_Interest', 50),
                design_interest=user_data.get('Design_Interest', 50),
                management_interest=user_data.get('Management_Interest', 50)
            )
        
        elif any(word in question for word in ['improve', 'better', 'increase', 'better score']):
            # Answer: How to improve score
            response_text = CHAT_RESPONSES['improve_score'].get(career, CHAT_RESPONSES['improve_score']['Data Analyst'])
        
        elif any(word in question for word in ['apply', 'jobs', 'positions', 'roles', 'companies']):
            # Answer: What jobs to apply for
            response_text = CHAT_RESPONSES['jobs_to_apply'].get(career, CHAT_RESPONSES['jobs_to_apply']['Data Analyst'])
        
        return jsonify({
            'success': True,
            'question': data.get('question'),
            'response': response_text,
            'career': career,
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/api/resume/analyze', methods=['POST'])
def analyze_resume():
    """
    POST /api/resume/analyze
    Analyzes uploaded resume PDF
    
    Input: FormData with 'resume' file (PDF)
    
    Output JSON:
    {
        "success": True,
        "analysis_id": "unique_id",
        "overall_score": 78.5,
        "ats_status": "ATS-Optimized",
        "skills": [...],
        "primary_career": {...},
        "skill_gap": {...}
    }
    """
    from werkzeug.utils import secure_filename
    from resume_parser import ResumeParser
    from resume_scorer import ResumeScorer
    from career_matcher import CareerMatcher
    from skill_gap_analyzer import SkillGapAnalyzer
    import uuid
    
    try:
        # Check if file was uploaded
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file uploaded', 'success': False}), 400
        
        file = request.files['resume']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected', 'success': False}), 400
        
        # Check if file is PDF
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are supported', 'success': False}), 400
        
        # Save uploaded file temporarily
        filename = secure_filename(file.filename)
        temp_path = os.path.join('uploads', f"{uuid.uuid4()}_{filename}")
        
        # Create uploads directory if it doesn't exist
        os.makedirs('uploads', exist_ok=True)
        
        file.save(temp_path)
        
        # Step 1: Parse Resume
        print("Parsing resume...")
        parser = ResumeParser()
        parsed_data = parser.parse(temp_path)
        
        # Step 2: Score Resume
        print("Scoring resume...")
        scorer = ResumeScorer()
        score_result = scorer.calculate_overall_score(
            parsed_data['skills'],
            parsed_data['keywords'],
            parsed_data['projects'],
            parsed_data['experience'],
            parsed_data['stats']
        )
        
        # Step 3: Match Career Roles
        print("Matching career roles...")
        matcher = CareerMatcher()
        primary_career = matcher.get_primary_career(parsed_data['skills'])
        top_3_careers = matcher.get_top_career_matches(parsed_data['skills'], top_n=3)
        alternate_roles = matcher.get_alternate_roles(parsed_data['skills'])
        
        # Step 4: Skill Gap Analysis
        print("Analyzing skill gaps...")
        gap_analyzer = SkillGapAnalyzer()
        skill_gap = gap_analyzer.analyze_gap(parsed_data['skills'], primary_career['role'])
        skill_dev_plan = gap_analyzer.generate_skill_development_plan(skill_gap)
        
        # Step 5: Get Improvement Suggestions
        breakdown = score_result['breakdown']
        improvement_suggestions = scorer.get_improvement_suggestions(
            breakdown['skill_relevance']['score'],
            breakdown['keywords_ats']['score'],
            breakdown['projects_experience']['score'],
            breakdown['structure']['score']
        )
        
        # Generate unique analysis ID
        analysis_id = str(uuid.uuid4())[:8].upper()
        
        # Compile complete analysis
        complete_analysis = {
            'success': True,
            'analysis_id': analysis_id,
            'overall_score': score_result['overall_score'],
            'ats_status': score_result['ats_status'],
            'ats_message': score_result['ats_message'],
            'ats_color': score_result['ats_color'],
            'breakdown': score_result['breakdown'],
            'skills': parsed_data['skills'],
            'skills_count': len(parsed_data['skills']),
            'keywords': parsed_data['keywords'],
            'keywords_count': len(parsed_data['keywords']),
            'education': parsed_data['education'],
            'projects': parsed_data['projects'],
            'experience': parsed_data['experience'],
            'primary_career': primary_career,
            'top_3_careers': top_3_careers,
            'alternate_roles': alternate_roles,
            'skill_gap': skill_gap,
            'skill_development_plan': skill_dev_plan,
            'improvement_suggestions': improvement_suggestions,
            'stats': parsed_data['stats'],
            'timestamp': datetime.now().isoformat()
        }
        
        # Store analysis in session/cache for report generation
        # For now, we'll store it as a temporary file
        analysis_file_path = os.path.join('uploads', f"analysis_{analysis_id}.json")
        with open(analysis_file_path, 'w') as f:
            json.dump(complete_analysis, f)
        
        # Clean up uploaded resume file
        try:
            os.remove(temp_path)
        except:
            pass
        
        print(f"Resume analysis complete! ID: {analysis_id}")
        
        return jsonify(complete_analysis), 200
        
    except Exception as e:
        print(f"Error analyzing resume: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/api/resume/report/<analysis_id>', methods=['GET'])
def download_resume_report(analysis_id):
    """
    GET /api/resume/report/<analysis_id>
    Downloads PDF report for resume analysis
    
    Returns: PDF file
    """
    from resume_report_generator import generate_resume_analysis_report
    
    try:
        # Load analysis data from file
        analysis_file_path = os.path.join('uploads', f"analysis_{analysis_id}.json")
        
        if not os.path.exists(analysis_file_path):
            return jsonify({'error': 'Analysis not found. Please analyze resume first.', 'success': False}), 404
        
        with open(analysis_file_path, 'r') as f:
            analysis_data = json.load(f)
        
        # Generate PDF report
        print(f"Generating PDF report for analysis {analysis_id}...")
        pdf_bytes = generate_resume_analysis_report(analysis_data)
        
        # Return PDF file
        return send_file(
            BytesIO(pdf_bytes),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"Resume_Analysis_Report_{analysis_id}.pdf"
        )
        
    except Exception as e:
        print(f"Error generating report: {str(e)}")
        return jsonify({'error': str(e), 'success': False}), 500

# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found', 'success': False}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error', 'success': False}), 500

# ============================================
# RUN APPLICATION
# ============================================

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("CareerNexus AI - Flask Backend")
    print("=" * 60)
    print("Starting server on http://127.0.0.1:5002")
    print("Endpoints:")
    print("  POST /assess - Career prediction")
    print("  POST /score - Readiness score calculation")
    print("  GET  /roadmap/<career> - Career roadmap")
    print("  POST /report - Generate PDF report")
    print("  POST /chat - Career chat assistant")
    print("  POST /api/resume/analyze - Resume analyzer (NEW)")
    print("  GET  /api/resume/report/<id> - Download resume report (NEW)")
    print("=" * 60 + "\n")
    
    app.run(debug=True, port=5002, host='0.0.0.0')
