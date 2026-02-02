"""
Resume Scorer Module
====================
Calculates ATS-style resume scores based on:
- Skill relevance (40%)
- Keywords & ATS compatibility (30%)
- Projects & experience (20%)
- Resume structure & completeness (10%)

Author: CareerNexus AI
"""

from typing import Dict, List

# ============================================
# SCORING WEIGHTS
# ============================================

WEIGHTS = {
    'skill_relevance': 0.40,      # 40% weight
    'keywords_ats': 0.30,          # 30% weight
    'projects_experience': 0.20,   # 20% weight
    'structure': 0.10              # 10% weight
}

# Minimum thresholds for scoring
MIN_SKILLS = 3
MIN_KEYWORDS = 5
MIN_PROJECTS = 1

# ATS Status thresholds
ATS_POOR_THRESHOLD = 40
ATS_AVERAGE_THRESHOLD = 70


class ResumeScorer:
    """
    Resume Scorer class that calculates comprehensive ATS-style scores.
    """
    
    def __init__(self):
        """Initialize the resume scorer."""
        pass
    
    def calculate_skill_score(self, found_skills: List[str], total_skills: int = 150) -> float:
        """
        Calculate skill relevance score (0-100).
        
        Formula:
        - Base score from number of skills found
        - Bonus for diversity (skills from different categories)
        - Penalty if too few skills
        
        Args:
            found_skills: List of skills found in resume
            total_skills: Total possible skills (default 150)
            
        Returns:
            Score between 0-100
        """
        skills_count = len(found_skills)
        
        if skills_count == 0:
            return 0
        
        # Base score: logarithmic scaling (diminishing returns after many skills)
        # Score = min(100, (skills_count / 20) * 100)
        # This means 20 skills = 100 score, scales logarithmically before that
        base_score = min(100, (skills_count / 20) * 100)
        
        # Penalty if too few skills
        if skills_count < MIN_SKILLS:
            penalty = (MIN_SKILLS - skills_count) * 10
            base_score = max(0, base_score - penalty)
        
        return round(base_score, 2)
    
    def calculate_keywords_score(self, found_keywords: List[str], expected_keywords: int = 30) -> float:
        """
        Calculate ATS keywords score (0-100).
        
        ATS systems look for action verbs and result-oriented language.
        
        Args:
            found_keywords: List of ATS keywords found in resume
            expected_keywords: Expected number of keywords (default 30)
            
        Returns:
            Score between 0-100
        """
        keywords_count = len(found_keywords)
        
        if keywords_count == 0:
            return 0
        
        # Linear scoring: each keyword contributes
        # 15 keywords = 100 score
        base_score = min(100, (keywords_count / 15) * 100)
        
        # Penalty if too few keywords
        if keywords_count < MIN_KEYWORDS:
            penalty = (MIN_KEYWORDS - keywords_count) * 5
            base_score = max(0, base_score - penalty)
        
        return round(base_score, 2)
    
    def calculate_projects_experience_score(
        self, 
        projects: List[str], 
        experience: List[str]
    ) -> float:
        """
        Calculate projects and experience score (0-100).
        
        Both projects and experience demonstrate practical application.
        
        Args:
            projects: List of projects found in resume
            experience: List of experience entries found in resume
            
        Returns:
            Score between 0-100
        """
        projects_count = len(projects)
        experience_count = len(experience)
        
        # Projects worth 50%, experience worth 50%
        # 3 projects = 50 points, 3 experience entries = 50 points
        project_score = min(50, (projects_count / 3) * 50)
        experience_score = min(50, (experience_count / 3) * 50)
        
        total_score = project_score + experience_score
        
        # Bonus for having both projects AND experience
        if projects_count > 0 and experience_count > 0:
            total_score = min(100, total_score * 1.1)
        
        # Penalty if no projects and no experience
        if projects_count == 0 and experience_count == 0:
            return 0
        
        return round(total_score, 2)
    
    def calculate_structure_score(self, resume_stats: Dict) -> float:
        """
        Calculate resume structure and completeness score (0-100).
        
        Checks for:
        - Contact information (email, phone)
        - Reasonable length (not too short, not too long)
        - Multiple sections present
        
        Args:
            resume_stats: Statistics about the resume (word count, sections, etc.)
            
        Returns:
            Score between 0-100
        """
        score = 0
        
        # 1. Contact info (30 points)
        if resume_stats.get('has_contact_info', False):
            score += 30
        
        # 2. Resume length (40 points)
        word_count = resume_stats.get('word_count', 0)
        if 200 <= word_count <= 800:  # Ideal resume length
            score += 40
        elif 100 <= word_count < 200 or 800 < word_count <= 1200:  # Acceptable
            score += 25
        elif word_count > 0:  # Too short or too long
            score += 10
        
        # 3. Multiple sections (30 points)
        skills_count = resume_stats.get('skills_count', 0)
        keywords_count = resume_stats.get('keywords_count', 0)
        
        if skills_count > 0:
            score += 15
        if keywords_count > 0:
            score += 15
        
        return round(min(100, score), 2)
    
    def calculate_overall_score(
        self,
        found_skills: List[str],
        found_keywords: List[str],
        projects: List[str],
        experience: List[str],
        resume_stats: Dict
    ) -> Dict:
        """
        Calculate overall ATS resume score.
        
        Combines all component scores with weighted formula:
        Score = (Skill × 0.40) + (Keywords × 0.30) + (Projects/Exp × 0.20) + (Structure × 0.10)
        
        Args:
            found_skills: Skills found in resume
            found_keywords: ATS keywords found in resume
            projects: Projects found in resume
            experience: Experience entries found in resume
            resume_stats: Resume statistics
            
        Returns:
            Dictionary with overall score, breakdown, and ATS status
        """
        # Calculate component scores
        skill_score = self.calculate_skill_score(found_skills)
        keywords_score = self.calculate_keywords_score(found_keywords)
        projects_exp_score = self.calculate_projects_experience_score(projects, experience)
        structure_score = self.calculate_structure_score(resume_stats)
        
        # Calculate weighted overall score
        overall_score = (
            skill_score * WEIGHTS['skill_relevance'] +
            keywords_score * WEIGHTS['keywords_ats'] +
            projects_exp_score * WEIGHTS['projects_experience'] +
            structure_score * WEIGHTS['structure']
        )
        
        overall_score = round(overall_score, 2)
        
        # Determine ATS status
        if overall_score < ATS_POOR_THRESHOLD:
            ats_status = 'Poor'
            ats_message = 'Your resume needs significant improvement for ATS systems'
            ats_color = 'red'
        elif overall_score < ATS_AVERAGE_THRESHOLD:
            ats_status = 'Average'
            ats_message = 'Your resume is decent but could be optimized for ATS'
            ats_color = 'yellow'
        else:
            ats_status = 'ATS-Optimized'
            ats_message = 'Your resume is well-optimized for ATS systems!'
            ats_color = 'green'
        
        return {
            'overall_score': overall_score,
            'ats_status': ats_status,
            'ats_message': ats_message,
            'ats_color': ats_color,
            'breakdown': {
                'skill_relevance': {
                    'score': skill_score,
                    'weight': WEIGHTS['skill_relevance'] * 100,
                    'contribution': round(skill_score * WEIGHTS['skill_relevance'], 2)
                },
                'keywords_ats': {
                    'score': keywords_score,
                    'weight': WEIGHTS['keywords_ats'] * 100,
                    'contribution': round(keywords_score * WEIGHTS['keywords_ats'], 2)
                },
                'projects_experience': {
                    'score': projects_exp_score,
                    'weight': WEIGHTS['projects_experience'] * 100,
                    'contribution': round(projects_exp_score * WEIGHTS['projects_experience'], 2)
                },
                'structure': {
                    'score': structure_score,
                    'weight': WEIGHTS['structure'] * 100,
                    'contribution': round(structure_score * WEIGHTS['structure'], 2)
                }
            }
        }
    
    def get_improvement_suggestions(
        self,
        skill_score: float,
        keywords_score: float,
        projects_exp_score: float,
        structure_score: float
    ) -> List[str]:
        """
        Generate personalized improvement suggestions based on weak areas.
        
        Args:
            skill_score: Skill relevance score
            keywords_score: Keywords/ATS score
            projects_exp_score: Projects/experience score
            structure_score: Structure score
            
        Returns:
            List of actionable improvement suggestions
        """
        suggestions = []
        
        # Skill suggestions
        if skill_score < 60:
            suggestions.append(
                f"Add more relevant skills to your resume. Current skill score: {skill_score}/100. "
                "Include both technical and soft skills."
            )
        elif skill_score < 80:
            suggestions.append(
                "Expand your skills section with more specific technologies and tools you've used."
            )
        
        # Keywords suggestions
        if keywords_score < 60:
            suggestions.append(
                f"Use more action verbs and result-oriented language. Current keyword score: {keywords_score}/100. "
                "Include words like 'developed', 'implemented', 'improved', 'achieved'."
            )
        elif keywords_score < 80:
            suggestions.append(
                "Add more quantifiable achievements and action-oriented descriptions to improve ATS compatibility."
            )
        
        # Projects/experience suggestions
        if projects_exp_score < 60:
            suggestions.append(
                f"Add more projects and work experience. Current score: {projects_exp_score}/100. "
                "Include at least 2-3 significant projects and any relevant work experience."
            )
        elif projects_exp_score < 80:
            suggestions.append(
                "Elaborate on your existing projects and experience with more technical details and outcomes."
            )
        
        # Structure suggestions
        if structure_score < 60:
            suggestions.append(
                f"Improve resume structure and completeness. Current score: {structure_score}/100. "
                "Ensure you have clear sections for Education, Skills, Projects, and Experience."
            )
        
        # If resume is excellent, provide optimization tips
        if not suggestions:
            suggestions.append("Excellent resume! Consider tailoring it for specific job descriptions for even better results.")
        
        return suggestions[:5]  # Return max 5 suggestions


# ============================================
# UTILITY FUNCTIONS
# ============================================

def get_scoring_weights() -> Dict[str, float]:
    """Return the scoring weights used in calculations."""
    return WEIGHTS

def get_ats_thresholds() -> Dict[str, int]:
    """Return ATS status thresholds."""
    return {
        'poor': ATS_POOR_THRESHOLD,
        'average': ATS_AVERAGE_THRESHOLD,
        'optimized': 70
    }
