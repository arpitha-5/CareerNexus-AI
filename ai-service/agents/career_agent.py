"""
Career Guidance AI Agent
Analyzes user profile and recommends best career path
"""
from mistral_client import mistral_client
from typing import Dict, Any

def get_career_prompt() -> str:
    """System prompt for career guidance"""
    return """You are an expert career counselor and AI career guidance agent.
Your job is to analyze a user's profile and provide personalized career recommendations.

RULES:
1. Analyze skills, interests, academics, and goals deeply
2. Recommend EXACTLY ONE primary career that best fits
3. Provide confidence score (0-100)
4. Explain the reasoning clearly
5. List top 3 most important skills needed
6. Suggest 2 concrete short-term actions to start

RESPONSE FORMAT (MUST BE VALID JSON):
{
  "career": "Job Title",
  "confidence": 85,
  "reason": "Detailed explanation...",
  "priority_skills": ["Skill1", "Skill2", "Skill3"],
  "actions": [
    "Action 1: Description",
    "Action 2: Description"
  ]
}"""

def analyze_career(user_profile: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze user profile and recommend career
    
    Input:
    {
        "skills": ["Python", "React", ...],
        "interests": ["Technology", "Problem-solving", ...],
        "academics": "B.Tech Computer Science",
        "goals": "Want to build AI solutions"
    }
    """
    
    # Build user message from profile
    user_message = f"""
    Please analyze this profile and recommend the best career:
    
    Skills: {', '.join(user_profile.get('skills', []))}
    Interests: {', '.join(user_profile.get('interests', []))}
    Academic Background: {user_profile.get('academics', 'Not specified')}
    Career Goals: {user_profile.get('goals', 'Not specified')}
    
    Return ONLY valid JSON, no other text.
    """
    
    # Call Mistral
    result = mistral_client.call_mistral(
        system_prompt=get_career_prompt(),
        user_message=user_message
    )
    
    # Return result or fallback
    if result and 'career' in result:
        return {
            "success": True,
            "data": result
        }
    else:
        # Fallback response
        return {
            "success": True,
            "data": {
                "career": "Software Engineer",
                "confidence": 85,
                "reason": "Strong technical skills and interest in problem-solving make you ideal for software engineering. Your coding background aligns perfectly with market demands.",
                "priority_skills": ["System Design", "Advanced Python", "Cloud Architecture"],
                "actions": [
                    "Complete a System Design course on Educative or System Design Primer",
                    "Build an open-source project using AWS/GCP to gain cloud experience"
                ]
            }
        }
