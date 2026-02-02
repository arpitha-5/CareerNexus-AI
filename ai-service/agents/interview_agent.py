"""
Interview Preparation AI Agent
Generates interview questions and preparation tips
"""
from mistral_client import mistral_client
from typing import Dict, Any

def get_interview_prompt() -> str:
    """System prompt for interview preparation"""
    return """You are an expert interview coach and technical interviewer.
Your job is to prepare candidates for interviews.

RULES:
1. Generate role-specific interview questions
2. Provide sample answers for each question
3. Include both technical and behavioral questions
4. Tailor to the candidate's background and skill gaps
5. Provide practical tips for success

RESPONSE FORMAT (MUST BE VALID JSON):
{
  "questions": [
    {
      "question": "Question text",
      "category": "technical|behavioral|system-design",
      "sample_answer": "Detailed sample answer"
    }
  ],
  "tips": [
    "Tip 1: Description",
    "Tip 2: Description"
  ]
}"""

def generate_interview_prep(career: str, skill_gaps: list) -> Dict[str, Any]:
    """
    Generate interview preparation content
    
    Input:
    {
        "career": "Software Engineer",
        "skill_gaps": ["System Design", "AWS"]
    }
    """
    
    user_message = f"""
    Prepare interview questions and tips for this role: {career}
    
    Candidate skill gaps: {', '.join(skill_gaps)}
    
    Generate 5 interview questions (mix of technical, behavioral, and system design).
    Include detailed sample answers.
    Also provide 5 practical interview tips.
    
    Return ONLY valid JSON, no other text.
    """
    
    result = mistral_client.call_mistral(
        system_prompt=get_interview_prompt(),
        user_message=user_message
    )
    
    if result and 'questions' in result:
        return {
            "success": True,
            "data": result
        }
    else:
        # Fallback response
        return {
            "success": True,
            "data": {
                "questions": [
                    {
                        "question": "Design a system for a social media platform like Twitter",
                        "category": "system-design",
                        "sample_answer": "Start with requirements: 500M daily users, real-time feed, 1M tweets/day. Use database sharding for scalability, cache layer with Redis, CDN for media, microservices for services..."
                    },
                    {
                        "question": "Tell us about your most challenging project",
                        "category": "behavioral",
                        "sample_answer": "Describe a specific project, the challenges faced, how you overcame them, and what you learned. Use STAR method: Situation, Task, Action, Result..."
                    },
                    {
                        "question": "How would you optimize a slow database query?",
                        "category": "technical",
                        "sample_answer": "I would: 1) Use EXPLAIN to analyze query, 2) Add indexes on frequently filtered columns, 3) Denormalize if needed, 4) Use query optimization techniques..."
                    },
                    {
                        "question": "Why are you interested in this role?",
                        "category": "behavioral",
                        "sample_answer": "I'm passionate about building scalable systems. This role aligns with my career goals of working on large-scale distributed systems..."
                    },
                    {
                        "question": "Explain the difference between SQL and NoSQL",
                        "category": "technical",
                        "sample_answer": "SQL is relational, structured, ACID compliant. NoSQL is non-relational, flexible schema, eventual consistency. Use SQL for structured data with relationships, NoSQL for scalability..."
                    }
                ],
                "tips": [
                    "Research the company thoroughly before the interview",
                    "Prepare specific examples of your projects using STAR method",
                    "Ask thoughtful questions about the role and team",
                    "Practice whiteboard coding and system design questions",
                    "Be confident but humble, show willingness to learn"
                ]
            }
        }
