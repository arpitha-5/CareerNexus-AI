"""
Career Role Matcher Module
===========================
Predicts suitable career roles based on skills found in resume.
Uses keyword matching and skill clustering for role recommendations.

Author: CareerNexus AI
"""

from typing import Dict, List, Tuple

# ============================================
# CAREER ROLES DATABASE
# ============================================

CAREER_ROLES = {
    'Data Analyst': {
        'required_skills': [
            'sql', 'excel', 'python', 'tableau', 'power bi', 'data visualization',
            'statistics', 'data analysis', 'pandas', 'numpy'
        ],
        'preferred_skills': [
            'r', 'sas', 'business intelligence', 'dashboards', 'reporting'
        ],
        'keywords': [
            'data', 'analysis', 'analytics', 'dashboard', 'report', 'insight',
            'visualization', 'metrics', 'kpi'
        ]
    },
    
    'Machine Learning Engineer': {
        'required_skills': [
            'python', 'machine learning', 'tensorflow', 'pytorch', 'scikit-learn',
            'deep learning', 'neural networks', 'algorithm'
        ],
        'preferred_skills': [
            'nlp', 'computer vision', 'keras', 'spark', 'aws', 'docker',
            'mlflow', 'kubeflow'
        ],
        'keywords': [
            'ml', 'ai', 'model', 'training', 'prediction', 'optimization',
            'algorithm', 'research'
        ]
    },
    
    'Full Stack Developer': {
        'required_skills': [
            'javascript', 'react', 'node.js', 'html', 'css', 'sql',
            'rest api', 'git'
        ],
        'preferred_skills': [
            'typescript', 'vue', 'angular', 'express', 'mongodb', 'docker',
            'aws', 'microservices', 'graphql'
        ],
        'keywords': [
            'web', 'frontend', 'backend', 'full stack', 'application',
            'responsive', 'deployment'
        ]
    },
    
    'Data Scientist': {
        'required_skills': [
            'python', 'statistics', 'machine learning', 'pandas', 'numpy',
            'scikit-learn', 'data analysis', 'sql'
        ],
        'preferred_skills': [
            'r', 'deep learning', 'tensorflow', 'pytorch', 'spark', 'hadoop',
            'nlp', 'computer vision', 'a/b testing'
        ],
        'keywords': [
            'data science', 'research', 'model', 'statistical', 'hypothesis',
            'experiment', 'insight', 'prediction'
        ]
    },
    
    'Frontend Developer': {
        'required_skills': [
            'javascript', 'html', 'css', 'react', 'responsive design'
        ],
        'preferred_skills': [
            'typescript', 'vue', 'angular', 'sass', 'webpack', 'tailwind',
            'redux', 'next.js', 'performance optimization'
        ],
        'keywords': [
            'frontend', 'ui', 'ux', 'web', 'responsive', 'interactive',
            'design', 'component'
        ]
    },
    
    'Backend Developer': {
        'required_skills': [
            'python', 'java', 'node.js', 'sql', 'rest api', 'database'
        ],
        'preferred_skills': [
            'django', 'flask', 'spring boot', 'express', 'mongodb', 'redis',
            'microservices', 'docker', 'kubernetes', 'aws'
        ],
        'keywords': [
            'backend', 'api', 'server', 'database', 'microservices',
            'scalability', 'architecture'
        ]
    },
    
    'Business Analyst': {
        'required_skills': [
            'excel', 'sql', 'data analysis', 'communication', 'problem solving',
            'business intelligence'
        ],
        'preferred_skills': [
            'tableau', 'power bi', 'project management', 'agile', 'jira',
            'stakeholder management'
        ],
        'keywords': [
            'business', 'requirements', 'analysis', 'stakeholder', 'process',
            'improvement', 'strategy'
        ]
    },
    
    'DevOps Engineer': {
        'required_skills': [
            'docker', 'kubernetes', 'jenkins', 'git', 'linux', 'bash'
        ],
        'preferred_skills': [
            'aws', 'azure', 'gcp', 'terraform', 'ansible', 'prometheus',
            'grafana', 'ci/cd', 'monitoring'
        ],
        'keywords': [
            'devops', 'deployment', 'automation', 'infrastructure', 'ci/cd',
            'monitoring', 'scalability'
        ]
    },
    
    'Mobile Developer': {
        'required_skills': [
            'android', 'ios', 'kotlin', 'swift', 'java', 'react native'
        ],
        'preferred_skills': [
            'flutter', 'firebase', 'rest api', 'mobile ui', 'app store',
            'play store'
        ],
        'keywords': [
            'mobile', 'app', 'android', 'ios', 'native', 'responsive',
            'user experience'
        ]
    },
    
    'Project Manager': {
        'required_skills': [
            'project management', 'agile', 'scrum', 'leadership', 'communication'
        ],
        'preferred_skills': [
            'jira', 'kanban', 'stakeholder management', 'risk management',
            'budgeting', 'pmp'
        ],
        'keywords': [
            'project', 'management', 'team', 'delivery', 'planning',
            'coordination', 'stakeholder'
        ]
    }
}


class CareerMatcher:
    """
    Career Matcher class that predicts suitable roles based on skills.
    """
    
    def __init__(self):
        """Initialize the career matcher."""
        self.career_roles = CAREER_ROLES
    
    def calculate_role_match(self, user_skills: List[str], role_name: str) -> Dict:
        """
        Calculate match percentage for a specific role.
        
        Args:
            user_skills: List of skills from user's resume (lowercase)
            role_name: Name of the career role to match
            
        Returns:
            Dictionary with match score and details
        """
        role = self.career_roles[role_name]
        user_skills_lower = [skill.lower() for skill in user_skills]
        
        # Count required skills match
        required_skills = role['required_skills']
        required_matches = sum(1 for skill in required_skills if skill in user_skills_lower)
        required_total = len(required_skills)
        
        # Count preferred skills match
        preferred_skills = role['preferred_skills']
        preferred_matches = sum(1 for skill in preferred_skills if skill in user_skills_lower)
        preferred_total = len(preferred_skills)
        
        # Calculate match percentage
        # Required skills weighted 70%, preferred skills weighted 30%
        if required_total > 0:
            required_percentage = (required_matches / required_total) * 70
        else:
            required_percentage = 0
        
        if preferred_total > 0:
            preferred_percentage = (preferred_matches / preferred_total) * 30
        else:
            preferred_percentage = 0
        
        total_match = round(required_percentage + preferred_percentage, 2)
        
        return {
            'role': role_name,
            'match_percentage': total_match,
            'required_skills_match': required_matches,
            'required_skills_total': required_total,
            'preferred_skills_match': preferred_matches,
            'preferred_skills_total': preferred_total,
            'matched_skills': [
                skill.title() for skill in user_skills_lower 
                if skill in required_skills or skill in preferred_skills
            ]
        }
    
    def get_top_career_matches(self, user_skills: List[str], top_n: int = 3) -> List[Dict]:
        """
        Get top N career role matches based on user skills.
        
        Args:
            user_skills: List of skills from user's resume
            top_n: Number of top matches to return (default 3)
            
        Returns:
            List of top career matches sorted by match percentage
        """
        matches = []
        
        for role_name in self.career_roles.keys():
            match_data = self.calculate_role_match(user_skills, role_name)
            matches.append(match_data)
        
        # Sort by match percentage (descending)
        matches.sort(key=lambda x: x['match_percentage'], reverse=True)
        
        return matches[:top_n]
    
    def get_primary_career(self, user_skills: List[str]) -> Dict:
        """
        Get the primary recommended career role.
        
        Args:
            user_skills: List of skills from user's resume
            
        Returns:
            Dictionary with primary career recommendation
        """
        top_matches = self.get_top_career_matches(user_skills, top_n=1)
        
        if top_matches:
            primary_match = top_matches[0]
            
            # Add confidence level
            match_percentage = primary_match['match_percentage']
            if match_percentage >= 70:
                confidence = 'High'
                confidence_message = 'Excellent fit! You have most of the required skills.'
            elif match_percentage >= 50:
                confidence = 'Medium'
                confidence_message = 'Good fit! Some skill development needed.'
            else:
                confidence = 'Low'
                confidence_message = 'Potential fit but significant skill gaps exist.'
            
            primary_match['confidence'] = confidence
            primary_match['confidence_message'] = confidence_message
            
            return primary_match
        
        # Fallback if no skills found
        return {
            'role': 'General Entry-Level',
            'match_percentage': 0,
            'confidence': 'Low',
            'confidence_message': 'Add more skills to your resume for better matching.'
        }
    
    def get_alternate_roles(self, user_skills: List[str]) -> List[str]:
        """
        Get alternate career roles (2nd and 3rd best matches).
        
        Args:
            user_skills: List of skills from user's resume
            
        Returns:
            List of alternate role names
        """
        top_matches = self.get_top_career_matches(user_skills, top_n=3)
        
        # Return 2nd and 3rd matches
        if len(top_matches) >= 3:
            return [top_matches[1]['role'], top_matches[2]['role']]
        elif len(top_matches) == 2:
            return [top_matches[1]['role']]
        else:
            return []


# ============================================
# UTILITY FUNCTIONS
# ============================================

def get_all_career_roles() -> List[str]:
    """Return list of all tracked career roles."""
    return list(CAREER_ROLES.keys())

def get_role_requirements(role_name: str) -> Dict:
    """
    Get skill requirements for a specific role.
    
    Args:
        role_name: Name of the career role
        
    Returns:
        Dictionary with role requirements
    """
    if role_name in CAREER_ROLES:
        return CAREER_ROLES[role_name]
    return {}
