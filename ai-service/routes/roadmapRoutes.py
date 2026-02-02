"""
CAREER ROADMAP API ROUTES
Flask Blueprint for personalized career roadmap generation and management
Provides endpoints for roadmap generation, task completion tracking, and PDF export
"""

from flask import Blueprint, request, jsonify, send_file
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Create Blueprint
roadmap_bp = Blueprint('roadmap', __name__, url_prefix='/api/career')

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def generate_skill_gap_tasks(
    career_role: str,
    missing_skills: List[str],
    strength_skills: List[str],
    experience_level: str,
    path: str = 'placement'
) -> List[Dict[str, Any]]:
    """
    Generate skill-gap-driven learning tasks
    
    Args:
        career_role: Target career (e.g., 'Data Analyst')
        missing_skills: List of skills to learn
        strength_skills: List of existing strong skills
        experience_level: 'Student', 'Fresher', 'Junior', 'Mid-level'
        path: 'internship', 'placement', or 'studies'
    
    Returns:
        List of task dictionaries with metadata
    """
    tasks = []
    
    # Skill learning task mapping
    skill_mapping = {
        'Power BI': {
            'days': 21,
            'xp': 300,
            'resume_boost': 12,
            'reason': 'Power BI is critical for Data Analyst roles - essential for visualization and reporting',
            'impact': 'Resume score +10-15%. Direct match with job requirements.'
        },
        'Advanced Excel': {
            'days': 14,
            'xp': 250,
            'resume_boost': 8,
            'reason': 'Foundation tool for data manipulation and pivot tables',
            'impact': 'Resume score +8%. Core skill expected in most analyst roles.'
        },
        'Machine Learning': {
            'days': 28,
            'xp': 400,
            'resume_boost': 15,
            'reason': 'Differentiator for senior analyst and data scientist roles',
            'impact': 'Resume score +15%. Opens opportunities for advanced positions.'
        },
        'SQL': {
            'days': 21,
            'xp': 300,
            'resume_boost': 10,
            'reason': 'Backbone of data analysis - essential for database queries',
            'impact': 'Resume score +10%. Required for 95% of data roles.'
        },
        'Python': {
            'days': 28,
            'xp': 350,
            'resume_boost': 12,
            'reason': 'Most in-demand programming language for data roles',
            'impact': 'Resume score +12%. Highly valued in analytics teams.'
        },
        'Tableau': {
            'days': 18,
            'xp': 280,
            'resume_boost': 10,
            'reason': 'Industry-standard visualization tool competing with Power BI',
            'impact': 'Resume score +10%. Increases versatility in visualization skills.'
        },
        'Statistics': {
            'days': 35,
            'xp': 400,
            'resume_boost': 13,
            'reason': 'Foundation for hypothesis testing and data insights',
            'impact': 'Resume score +13%. Essential for analytical credibility.'
        },
        'Data Visualization': {
            'days': 21,
            'xp': 280,
            'resume_boost': 11,
            'reason': 'Critical skill for communicating insights to stakeholders',
            'impact': 'Resume score +11%. Improves presentation impact.'
        }
    }
    
    # Generate task for each missing skill
    for skill in missing_skills:
        skill_info = skill_mapping.get(skill, {
            'days': 21,
            'xp': 300,
            'resume_boost': 10,
            'reason': f'{skill} is a valuable skill for {career_role} roles',
            'impact': f'Resume score +10%. Fills gap in {skill} expertise.'
        })
        
        task = {
            'id': f'skill-{skill.lower().replace(" ", "-")}',
            'title': f'Master {skill} for {career_role}',
            'description': f'Complete comprehensive training in {skill}. Learn through hands-on projects, online courses, and real-world applications.',
            'priority': 'High',
            'reason': skill_info['reason'],
            'impact': skill_info['impact'],
            'metric': 'resume',
            'estimatedDays': skill_info['days'],
            'resources': [
                f'{skill} Official Documentation',
                f'Udemy/Coursera {skill} Courses',
                f'Real-world {skill} Projects',
                f'Practice Exercises & Quizzes'
            ],
            'xpReward': skill_info['xp'],
            'status': 'pending',
            'locked': False,
            'resumeBoost': skill_info['resume_boost']
        }
        tasks.append(task)
    
    # Add portfolio building task
    portfolio_task = {
        'id': 'portfolio-projects',
        'title': f'Build {career_role} Portfolio Projects',
        'description': f'Create 2-3 end-to-end {career_role} projects showcasing skill application. Include data analysis, visualizations, and insights.',
        'priority': 'High',
        'reason': 'Portfolio is strongest proof of skills - differentiator between candidates',
        'impact': 'Resume score +20%. Interview confidence +30%. Portfolio projects are top hiring criteria.',
        'metric': 'portfolio',
        'estimatedDays': 28,
        'resources': [
            f'GitHub Portfolio Setup',
            f'Public Dataset Sources (Kaggle, UCI)',
            f'{career_role} Case Study Repositories',
            f'Project Documentation Best Practices'
        ],
        'xpReward': 500,
        'status': 'pending',
        'locked': False,
        'portfolioBoost': 25
    }
    tasks.append(portfolio_task)
    
    # Add resume optimization task
    resume_task = {
        'id': 'resume-optimization',
        'title': 'Optimize Resume for ATS & Hiring',
        'description': f'Tailor resume to {career_role} role. Use ATS-friendly formatting, highlight achievements with metrics, and optimize for keyword matching.',
        'priority': 'High',
        'reason': 'Resume is first impression - must pass ATS screening and impress hiring managers',
        'impact': 'Resume score +15%. 40% more interview callbacks with optimized resume.',
        'metric': 'resume',
        'estimatedDays': 5,
        'resources': [
            'ATS Resume Templates',
            'LinkedIn Profile Optimization',
            'Action Verb Best Practices',
            'Achievement Quantification Guide'
        ],
        'xpReward': 200,
        'status': 'pending',
        'locked': False,
        'resumeBoost': 15
    }
    tasks.append(resume_task)
    
    # Add interview preparation task
    interview_task = {
        'id': 'interview-preparation',
        'title': f'Prepare for {career_role} Technical Interviews',
        'description': f'Master interview questions specific to {career_role} roles. Practice case studies, technical problems, and behavioral scenarios.',
        'priority': 'High',
        'reason': 'Interview is decisive stage - must demonstrate competency and confidence',
        'impact': 'Interview readiness +35%. Confidence score +25%. Pass 90%+ of interviews with preparation.',
        'metric': 'interview',
        'estimatedDays': 21 if experience_level != 'Student' else 30,
        'resources': [
            f'{career_role} Interview Questions Database',
            'Case Study Walkthroughs',
            'Mock Interview Sessions',
            'Communication Skills Training'
        ],
        'xpReward': 400,
        'status': 'pending',
        'locked': False,
        'interviewBoost': 35
    }
    tasks.append(interview_task)
    
    # Add path-specific execution task
    if path == 'internship':
        execution_task = {
            'id': 'internship-targeting',
            'title': 'Target & Secure Internship',
            'description': f'Create list of target companies, customize applications, practice interviews, and execute internship search strategy.',
            'priority': 'High',
            'reason': 'Internship provides real experience and first-resume entry point',
            'impact': 'First professional experience +40%. CV foundation built.',
            'metric': 'experience',
            'estimatedDays': 60,
            'resources': [
                'Internship Portal Guides (LinkedIn, Unstop, AngelList)',
                'Cover Letter Templates',
                'Company Research Framework',
                'Offer Negotiation Guide'
            ],
            'xpReward': 1000,
            'status': 'pending',
            'locked': False,
            'experienceBoost': 40
        }
    elif path == 'placement':
        execution_task = {
            'id': 'job-execution',
            'title': 'Execute Job Search & Land Offer',
            'description': f'Build targeting strategy for {career_role} roles, submit applications, pass interviews, and negotiate offer.',
            'priority': 'High',
            'reason': 'Job placement is end goal - requires systematic execution and persistence',
            'impact': 'Successfully land job with 40%+ higher salary through preparation.',
            'metric': 'experience',
            'estimatedDays': 90,
            'resources': [
                'Job Portal Strategy (LinkedIn, Indeed, Naukri)',
                'Company Target List Builder',
                'Salary Negotiation Framework',
                'Offer Comparison Tool'
            ],
            'xpReward': 2000,
            'status': 'pending',
            'locked': False,
            'experienceBoost': 50
        }
    else:  # studies
        execution_task = {
            'id': 'further-studies',
            'title': 'Pursue Higher Studies',
            'description': f'Prepare for Master\'s or advanced certification in {career_role} specialization. Research programs, prepare applications.',
            'priority': 'High',
            'reason': 'Advanced education opens senior roles and specialization opportunities',
            'impact': 'Career advancement +50%. Salary growth potential +30-40%.',
            'metric': 'education',
            'estimatedDays': 120,
            'resources': [
                'Program Research Framework',
                'IELTS/GRE Preparation',
                'SOP Writing Guide',
                'Application Timeline Planner'
            ],
            'xpReward': 2000,
            'status': 'pending',
            'locked': False,
            'educationBoost': 50
        }
    
    tasks.append(execution_task)
    
    return tasks


def organize_into_phases(
    all_tasks: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Organize tasks into 4 sequential career phases with locking logic
    
    Phases:
    1. Foundation (0-30 days) - Learn core skills, locked: false
    2. Portfolio (30-60 days) - Build projects, locked until Phase 1 50%
    3. Industry Readiness (60-90 days) - Interview prep, locked until Phase 2 70%
    4. Execution (90+ days) - Apply jobs, locked until Phase 3 70%
    """
    phases = [
        {
            'id': 'foundation',
            'name': 'Foundation Phase',
            'number': 1,
            'duration': '3-4 weeks',
            'description': 'Master core skills required for your target role. Build strong technical foundation.',
            'icon': '🏗️',
            'color': '#3B82F6',
            'tasks': [],
            'completedTasks': 0,
            'locked': False,
            'unlockCondition': None,
            'progressPercent': 0
        },
        {
            'id': 'portfolio',
            'name': 'Portfolio Phase',
            'number': 2,
            'duration': '4 weeks',
            'description': 'Build real-world projects to demonstrate skills. Create portfolio pieces.',
            'icon': '📂',
            'color': '#8B5CF6',
            'tasks': [],
            'completedTasks': 0,
            'locked': True,
            'unlockCondition': 'Complete 50% of Foundation Phase',
            'progressPercent': 0
        },
        {
            'id': 'industry',
            'name': 'Industry Readiness',
            'number': 3,
            'duration': '3 weeks',
            'description': 'Prepare for interviews and industry standards. Polish communication skills.',
            'icon': '🚀',
            'color': '#EC4899',
            'tasks': [],
            'completedTasks': 0,
            'locked': True,
            'unlockCondition': 'Complete 70% of Portfolio Phase',
            'progressPercent': 0
        },
        {
            'id': 'execution',
            'name': 'Execution Phase',
            'number': 4,
            'duration': '2-3 months',
            'description': 'Execute your path - job search, internships, or further studies.',
            'icon': '⚡',
            'color': '#10B981',
            'tasks': [],
            'completedTasks': 0,
            'locked': True,
            'unlockCondition': 'Complete 70% of Industry Readiness Phase',
            'progressPercent': 0
        }
    ]
    
    # Distribute tasks into phases
    for task in all_tasks:
        if task['metric'] == 'resume':  # Skill and resume tasks → Foundation
            phases[0]['tasks'].append(task)
        elif task['id'] == 'portfolio-projects':  # Portfolio → Portfolio Phase
            phases[1]['tasks'].append(task)
        elif task['id'] == 'resume-optimization':  # Resume optimization → Portfolio Phase
            phases[1]['tasks'].append(task)
        elif task['id'] == 'interview-preparation':  # Interview → Industry Phase
            phases[2]['tasks'].append(task)
        else:  # Execution tasks → Execution Phase
            phases[3]['tasks'].append(task)
    
    return phases


def calculate_health_status(
    readiness_score: float,
    confidence_score: float,
    completed_tasks: int,
    total_tasks: int
) -> Dict[str, Any]:
    """
    Calculate health status based on scores and progress
    
    Returns:
        {
            'status': 'On Track' | 'Needs Attention' | 'Off Track',
            'completionRate': float,
            'readinessScore': float,
            'confidenceScore': float,
            'reason': str
        }
    """
    completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    
    if readiness_score >= 70 and confidence_score >= 75 and completion_rate > 60:
        status = 'On Track'
        reason = f'Excellent progress! Readiness at {readiness_score}% and completing tasks consistently.'
    elif readiness_score >= 50 and confidence_score >= 60 and completion_rate > 30:
        status = 'Needs Attention'
        reason = f'Good start! Maintain momentum. Focus on completing more tasks to improve readiness.'
    else:
        status = 'Off Track'
        reason = 'Get started now! Complete initial tasks to build momentum and confidence.'
    
    return {
        'status': status,
        'completionRate': round(completion_rate, 1),
        'readinessScore': round(readiness_score, 1),
        'confidenceScore': round(confidence_score, 1),
        'reason': reason
    }


def calculate_impact_preview(
    missing_skills_count: int,
    current_resume_score: float,
    current_readiness_score: float
) -> Dict[str, Any]:
    """
    Calculate estimated impact if roadmap is completed
    
    Returns impact preview with before/after scores
    """
    skill_impact = min(missing_skills_count * 4 + 5, 25)
    readiness_impact = min(15 + missing_skills_count * 3, 30)
    
    estimated_resume = min(100, current_resume_score + skill_impact)
    estimated_readiness = min(100, current_readiness_score + readiness_impact)
    
    timeline_weeks = (missing_skills_count * 3 + 12) // 4
    success_probability = min(95, 40 + (estimated_readiness / 100 * 50))
    
    return {
        'currentScores': {
            'resume': round(current_resume_score, 1),
            'readiness': round(current_readiness_score, 1)
        },
        'estimatedScores': {
            'resume': round(estimated_resume, 1),
            'readiness': round(estimated_readiness, 1)
        },
        'improvements': {
            'resume': round(skill_impact, 1),
            'readiness': round(readiness_impact, 1)
        },
        'timelineWeeks': timeline_weeks,
        'successProbability': f'{round(success_probability)}%'
    }


# ============================================================================
# API ENDPOINTS
# ============================================================================

@roadmap_bp.route('/roadmap', methods=['GET'])
def get_roadmap():
    """
    Fetch personalized career roadmap
    
    Query Parameters:
        - path: 'internship', 'placement', or 'studies' (default: 'placement')
        - userId: Optional - fetch user's previous roadmap from DB
        - careerRole: Optional - override with specific career role
    
    Response:
        {
            'success': true,
            'data': {
                'career': str,
                'confidence': float,
                'path': str,
                'experienceLevel': str,
                'phases': [...],
                'health': {...},
                'impactPreview': {...},
                'stats': {...},
                'generatedAt': datetime
            }
        }
    """
    try:
        path = request.args.get('path', 'placement')
        user_id = request.args.get('userId')
        career_role = request.args.get('careerRole', 'Data Analyst')
        
        # TODO: Fetch user's previous career analysis from database
        # For now, using sample data
        
        sample_data = {
            'primaryCareer': career_role,
            'confidence': 82,
            'resumeScore': 65,
            'readinessScore': 58,
            'strengthSkills': ['Python', 'Excel', 'Statistical Analysis'],
            'missingSkills': ['Power BI', 'Advanced Excel', 'SQL', 'Machine Learning'],
            'experienceLevel': 'Fresher'
        }
        
        # Generate skill-gap tasks
        tasks = generate_skill_gap_tasks(
            career_role=sample_data['primaryCareer'],
            missing_skills=sample_data['missingSkills'],
            strength_skills=sample_data['strengthSkills'],
            experience_level=sample_data['experienceLevel'],
            path=path
        )
        
        # Organize into phases
        phases = organize_into_phases(tasks)
        
        # Calculate health
        total_tasks = sum(len(phase['tasks']) for phase in phases)
        health = calculate_health_status(
            readiness_score=sample_data['readinessScore'],
            confidence_score=sample_data['confidence'],
            completed_tasks=0,
            total_tasks=total_tasks
        )
        
        # Calculate impact preview
        impact = calculate_impact_preview(
            missing_skills_count=len(sample_data['missingSkills']),
            current_resume_score=sample_data['resumeScore'],
            current_readiness_score=sample_data['readinessScore']
        )
        
        # Compile response
        response = {
            'success': True,
            'data': {
                'career': sample_data['primaryCareer'],
                'confidence': sample_data['confidence'],
                'path': path,
                'experienceLevel': sample_data['experienceLevel'],
                'phases': phases,
                'health': health,
                'impactPreview': impact,
                'stats': {
                    'totalTasks': total_tasks,
                    'completedTasks': 0,
                    'totalXP': sum(task['xpReward'] for phase in phases for task in phase['tasks']),
                    'currentXP': 0,
                    'completionPercent': 0
                },
                'generatedAt': datetime.now().isoformat()
            }
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Error generating roadmap: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@roadmap_bp.route('/roadmap/task/<task_id>/complete', methods=['POST'])
def complete_task(task_id):
    """
    Mark a task as complete and update scores
    
    Request body:
        {
            'userId': 'user123',
            'phaseId': 'foundation'
        }
    
    Response:
        {
            'success': true,
            'data': {
                'taskId': str,
                'status': 'completed',
                'xpGained': int,
                'newReadinessScore': float,
                'message': str
            }
        }
    """
    try:
        data = request.get_json() or {}
        user_id = data.get('userId')
        
        # TODO: Update database - mark task complete, update XP, recalculate scores
        
        return jsonify({
            'success': True,
            'data': {
                'taskId': task_id,
                'status': 'completed',
                'xpGained': 300,
                'newReadinessScore': 62.5,
                'message': f'Task completed! You earned 300 XP. Readiness improved to 62.5%'
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error completing task: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@roadmap_bp.route('/roadmap/export/pdf', methods=['GET'])
def export_roadmap_pdf():
    """
    Export personalized roadmap as PDF
    
    Query Parameters:
        - userId: User to export
    
    Response:
        PDF file download
    """
    try:
        user_id = request.args.get('userId')
        
        # TODO: Generate PDF with:
        # - Career role and target path
        # - All 4 phases with tasks
        # - Health indicator
        # - Impact preview
        # - Timeline
        
        # For now, return placeholder
        return jsonify({
            'success': False,
            'message': 'PDF export coming soon - use ReportLab or WeasyPrint'
        }), 501
        
    except Exception as e:
        logger.error(f"Error exporting PDF: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================================
# BLUEPRINT REGISTRATION
# ============================================================================

def register_roadmap_routes(app):
    """
    Register roadmap blueprint with Flask app
    
    Usage in app.py:
        from routes.roadmapRoutes import register_roadmap_routes
        register_roadmap_routes(app)
    """
    app.register_blueprint(roadmap_bp)
    logger.info('✓ Career Roadmap API routes registered')
    logger.info('  ├─ GET  /api/career/roadmap')
    logger.info('  ├─ POST /api/career/roadmap/task/{taskId}/complete')
    logger.info('  └─ GET  /api/career/roadmap/export/pdf')
