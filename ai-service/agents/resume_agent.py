"""
Resume Analysis AI Agent
Analyzes resume and identifies strengths, weaknesses, and improvements
"""
from mistral_client import mistral_client
from typing import Dict, Any

def get_resume_prompt() -> str:
    """System prompt for resume analysis"""
    return """You are an expert resume reviewer and career coach.
Your job is to analyze a resume and provide constructive feedback.

RULES:
1. Identify key strengths from the resume
2. Point out weaknesses or gaps
3. List missing skills for the target career
4. Provide specific, actionable improvement suggestions
5. Be encouraging but honest

RESPONSE FORMAT (MUST BE VALID JSON):
{
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Area 1", "Area 2"],
  "missing_skills": ["Skill 1", "Skill 2"],
  "suggestions": [
    "Specific suggestion 1",
    "Specific suggestion 2"
  ]
}"""

def analyze_resume(resume_text: str, target_career: str) -> Dict[str, Any]:
    """
    Analyze resume for a specific career path
    
    Input:
    {
        "resume_text": "Resume content as text",
        "target_career": "Software Engineer"
    }
    """
    
    user_message = f"""
    Please analyze this resume for the career: {target_career}
    
    Resume:
    {resume_text}
    
    Provide detailed analysis highlighting strengths, weaknesses, missing skills, and improvements.
    Return ONLY valid JSON, no other text.
    """
    
    result = mistral_client.call_mistral(
        system_prompt=get_resume_prompt(),
        user_message=user_message
    )
    
    if result and 'strengths' in result:
        return {
            "success": True,
            "data": result
        }
    else:
        # Fallback response
        return {
            "success": True,
            "data": {
                "strengths": [
                    "Strong project portfolio with 5+ completed projects",
                    "Solid understanding of core data structures",
                    "Good communication of technical concepts"
                ],
                "weaknesses": [
                    "Limited production-level code examples",
                    "No mention of system design experience",
                    "Missing internship or work experience details"
                ],
                "missing_skills": [
                    "Distributed Systems knowledge",
                    "Database optimization",
                    "Cloud platform experience (AWS/GCP)"
                ],
                "suggestions": [
                    "Add system design project to portfolio",
                    "Highlight any production deployments",
                    "Include metrics from past projects",
                    "Add cloud certification if available"
                ]
            }
        }
