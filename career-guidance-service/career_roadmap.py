"""
Career Roadmap Generator
Provides structured 6-month roadmaps for different careers
"""

# Career-specific roadmaps (no generic content, only career actions)
CAREER_ROADMAPS = {
    'Data Analyst': {
        'skills_focus': ['SQL', 'Python', 'Tableau', 'Excel'],
        'key_topics': ['Data Cleaning', 'Statistical Analysis', 'Dashboard Creation', 'Business Metrics'],
        'projects': [
            'E-commerce sales analysis using SQL',
            'Customer segmentation with Python',
            'Interactive dashboard with Tableau'
        ]
    },
    'ML Engineer': {
        'skills_focus': ['Python', 'TensorFlow', 'PyTorch', 'ML Algorithms'],
        'key_topics': ['Deep Learning', 'NLP', 'Computer Vision', 'Model Deployment'],
        'projects': [
            'Image classification with CNN',
            'Text sentiment analysis with BERT',
            'Time series prediction model'
        ]
    },
    'Full Stack Developer': {
        'skills_focus': ['React', 'Node.js', 'MongoDB', 'Docker'],
        'key_topics': ['REST APIs', 'Authentication', 'Databases', 'DevOps'],
        'projects': [
            'E-commerce website with React + Node',
            'Social media app with real-time features',
            'SaaS application deployed on AWS'
        ]
    },
    'Data Scientist': {
        'skills_focus': ['Python', 'Statistics', 'Machine Learning', 'Big Data'],
        'key_topics': ['Statistical Modeling', 'Deep Learning', 'Feature Engineering', 'Research'],
        'projects': [
            'Predictive modeling for business',
            'Kaggle competition participation',
            'Research paper implementation'
        ]
    },
    'Frontend Developer': {
        'skills_focus': ['React', 'CSS', 'JavaScript', 'Design Systems'],
        'key_topics': ['Performance Optimization', 'Accessibility', 'Responsive Design', 'UI/UX'],
        'projects': [
            'Personal portfolio website',
            'Component library creation',
            'E-commerce UI implementation'
        ]
    },
    'Business Analyst': {
        'skills_focus': ['Excel', 'SQL', 'Tableau', 'Business Acumen'],
        'key_topics': ['Requirements Gathering', 'Process Analysis', 'Data Storytelling', 'Market Research'],
        'projects': [
            'Business process optimization',
            'Competitive market analysis',
            'Stakeholder presentation'
        ]
    },
    'Project Manager': {
        'skills_focus': ['Agile/Scrum', 'Communication', 'Leadership', 'Tools (Jira/Asana)'],
        'key_topics': ['Project Planning', 'Risk Management', 'Team Management', 'Stakeholder Communication'],
        'projects': [
            'Lead cross-functional project',
            'Process improvement initiative',
            'Team mentoring program'
        ]
    }
}

def get_roadmap(career):
    """Get roadmap for a specific career"""
    return CAREER_ROADMAPS.get(career, None)

def get_available_careers():
    """Get all available careers"""
    return list(CAREER_ROADMAPS.keys())
