"""
Skill Gap Analyzer Module
==========================
Analyzes gaps between current skills and required skills for target career roles.
Provides actionable recommendations for skill development.

Author: CareerNexus AI
"""

from typing import Dict, List, Set
from career_matcher import get_role_requirements

class SkillGapAnalyzer:
    """
    Skill Gap Analyzer class that identifies missing skills and provides recommendations.
    """
    
    def __init__(self):
        """Initialize the skill gap analyzer."""
        pass
    
    def analyze_gap(self, user_skills: List[str], target_role: str) -> Dict:
        """
        Analyze skill gap for a specific target role.
        
        Args:
            user_skills: List of skills from user's resume
            target_role: Target career role name
            
        Returns:
            Dictionary with skill gap analysis
        """
        # Get role requirements
        role_requirements = get_role_requirements(target_role)
        
        if not role_requirements:
            return {
                'error': f'Role "{target_role}" not found',
                'missing_skills': [],
                'matched_skills': [],
                'strength_areas': []
            }
        
        # Normalize user skills to lowercase
        user_skills_lower = set([skill.lower() for skill in user_skills])
        
        # Get required and preferred skills for the role
        required_skills = set(role_requirements.get('required_skills', []))
        preferred_skills = set(role_requirements.get('preferred_skills', []))
        
        # Calculate matches
        matched_required = required_skills.intersection(user_skills_lower)
        missing_required = required_skills.difference(user_skills_lower)
        
        matched_preferred = preferred_skills.intersection(user_skills_lower)
        missing_preferred = preferred_skills.difference(user_skills_lower)
        
        # All matched skills
        all_matched = matched_required.union(matched_preferred)
        
        # Categorize into priority levels
        critical_missing = list(missing_required)  # Must-have skills
        nice_to_have_missing = list(missing_preferred)  # Good-to-have skills
        
        # Calculate gap percentage
        total_required = len(required_skills) + len(preferred_skills)
        total_matched = len(all_matched)
        gap_percentage = round(((total_required - total_matched) / total_required * 100) if total_required > 0 else 0, 2)
        
        return {
            'target_role': target_role,
            'matched_skills': sorted([skill.title() for skill in all_matched]),
            'matched_count': total_matched,
            'missing_critical': sorted([skill.title() for skill in critical_missing]),
            'missing_nice_to_have': sorted([skill.title() for skill in nice_to_have_missing]),
            'missing_count': len(critical_missing) + len(nice_to_have_missing),
            'gap_percentage': gap_percentage,
            'skill_match_percentage': round(100 - gap_percentage, 2),
            'strength_areas': self._identify_strength_areas(all_matched)
        }
    
    def _identify_strength_areas(self, matched_skills: Set[str]) -> List[str]:
        """
        Identify strength areas based on matched skills.
        
        Args:
            matched_skills: Set of matched skills
            
        Returns:
            List of strength area descriptions
        """
        strengths = []
        matched_lower = [skill.lower() for skill in matched_skills]
        
        # Programming strength
        programming_skills = ['python', 'java', 'javascript', 'c++', 'c#', 'typescript']
        if any(skill in matched_lower for skill in programming_skills):
            strengths.append('Strong programming foundation')
        
        # Data analysis strength
        data_skills = ['sql', 'pandas', 'numpy', 'data analysis', 'statistics']
        if any(skill in matched_lower for skill in data_skills):
            strengths.append('Solid data analysis capabilities')
        
        # Machine learning strength
        ml_skills = ['machine learning', 'deep learning', 'tensorflow', 'pytorch']
        if any(skill in matched_lower for skill in ml_skills):
            strengths.append('Advanced machine learning expertise')
        
        # Web development strength
        web_skills = ['react', 'angular', 'vue', 'node.js', 'html', 'css']
        if any(skill in matched_lower for skill in web_skills):
            strengths.append('Proficient in web development')
        
        # Cloud/DevOps strength
        cloud_skills = ['aws', 'azure', 'gcp', 'docker', 'kubernetes']
        if any(skill in matched_lower for skill in cloud_skills):
            strengths.append('Cloud infrastructure knowledge')
        
        # Soft skills strength
        soft_skills = ['communication', 'leadership', 'teamwork', 'project management']
        if any(skill in matched_lower for skill in soft_skills):
            strengths.append('Excellent soft skills and collaboration')
        
        return strengths if strengths else ['Developing technical expertise']
    
    def get_learning_recommendations(self, missing_critical: List[str], missing_nice_to_have: List[str]) -> List[Dict]:
        """
        Get prioritized learning recommendations.
        
        Args:
            missing_critical: List of critical missing skills
            missing_nice_to_have: List of nice-to-have missing skills
            
        Returns:
            List of learning recommendations with priorities
        """
        recommendations = []
        
        # Critical skills (high priority)
        for skill in missing_critical[:5]:  # Top 5 critical
            recommendations.append({
                'skill': skill,
                'priority': 'High',
                'reason': 'Required for the role',
                'suggested_action': self._get_learning_action(skill.lower())
            })
        
        # Nice-to-have skills (medium priority)
        for skill in missing_nice_to_have[:3]:  # Top 3 nice-to-have
            recommendations.append({
                'skill': skill,
                'priority': 'Medium',
                'reason': 'Enhances your competitiveness',
                'suggested_action': self._get_learning_action(skill.lower())
            })
        
        return recommendations
    
    def _get_learning_action(self, skill: str) -> str:
        """
        Get specific learning action for a skill.
        
        Args:
            skill: Skill name (lowercase)
            
        Returns:
            Suggested learning action
        """
        # Programming languages
        if skill in ['python', 'java', 'javascript', 'typescript']:
            return f'Complete online course on {skill.title()} and build 2-3 projects'
        
        # Frameworks/Libraries
        if skill in ['react', 'angular', 'vue', 'django', 'flask', 'spring boot']:
            return f'Take {skill.title()} tutorial and build a full-stack application'
        
        # Data science tools
        if skill in ['pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn']:
            return f'Learn {skill.title()} through practical data projects on Kaggle'
        
        # Cloud platforms
        if skill in ['aws', 'azure', 'gcp']:
            return f'Get {skill.upper()} certification (Cloud Practitioner or Associate level)'
        
        # DevOps tools
        if skill in ['docker', 'kubernetes', 'jenkins']:
            return f'Complete hands-on {skill.title()} labs and deploy a sample application'
        
        # Databases
        if skill in ['sql', 'mongodb', 'postgresql', 'mysql']:
            return f'Practice {skill.upper()} queries and database design on LeetCode/HackerRank'
        
        # Data visualization
        if skill in ['tableau', 'power bi']:
            return f'Create 3 interactive dashboards using {skill.title()} with real datasets'
        
        # Soft skills
        if skill in ['communication', 'leadership', 'teamwork']:
            return f'Develop {skill} through team projects and public speaking practice'
        
        # Default
        return f'Learn {skill.title()} through online courses and practical projects'
    
    def generate_skill_development_plan(self, gap_analysis: Dict) -> Dict:
        """
        Generate a structured skill development plan.
        
        Args:
            gap_analysis: Result from analyze_gap()
            
        Returns:
            Structured learning plan
        """
        critical_skills = gap_analysis.get('missing_critical', [])
        nice_to_have_skills = gap_analysis.get('missing_nice_to_have', [])
        
        # Get recommendations
        recommendations = self.get_learning_recommendations(critical_skills, nice_to_have_skills)
        
        # Create timeline
        if len(critical_skills) >= 5:
            timeline = '3-6 months intensive learning'
        elif len(critical_skills) >= 2:
            timeline = '2-3 months focused learning'
        else:
            timeline = '1-2 months skill development'
        
        return {
            'timeline': timeline,
            'total_skills_to_learn': len(critical_skills) + len(nice_to_have_skills),
            'recommendations': recommendations,
            'next_steps': [
                'Start with high-priority skills first',
                'Build practical projects to demonstrate each skill',
                'Update your resume as you learn new skills',
                'Consider getting certifications for critical skills'
            ]
        }


# ============================================
# UTILITY FUNCTIONS
# ============================================

def quick_gap_analysis(user_skills: List[str], target_role: str) -> Dict:
    """
    Quick skill gap analysis (convenience function).
    
    Args:
        user_skills: List of user's skills
        target_role: Target career role
        
    Returns:
        Skill gap analysis
    """
    analyzer = SkillGapAnalyzer()
    return analyzer.analyze_gap(user_skills, target_role)
