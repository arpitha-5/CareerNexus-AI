"""
Learning Roadmap AI Agent
Generates structured learning paths for career development
"""
from mistral_client import mistral_client
from typing import Dict, Any

def get_roadmap_prompt() -> str:
    """System prompt for learning roadmap generation"""
    return """You are an expert career development coach and learning strategist.
Your job is to create personalized learning roadmaps for career progression.

RULES:
1. Analyze skill gaps and create actionable learning paths
2. Separate into short-term (1-3 months) and medium-term (3-6 months) goals
3. Each goal should have specific resources (courses, projects, books)
4. Prioritize high-impact skills
5. Include both technical and soft skills

RESPONSE FORMAT (MUST BE VALID JSON):
{
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
}"""

def generate_learning_roadmap(career: str, skill_gaps: list) -> Dict[str, Any]:
    """
    Generate personalized learning roadmap
    
    Input:
    {
        "career": "Software Engineer",
        "skill_gaps": ["System Design", "AWS", "Kubernetes"]
    }
    """
    
    user_message = f"""
    Create a learning roadmap for someone pursuing: {career}
    
    Primary skill gaps to address: {', '.join(skill_gaps)}
    
    Generate:
    1. 3-4 short-term goals (1-3 months) with resources and project ideas
    2. 3-4 medium-term goals (3-6 months) with resources and project ideas
    
    Focus on practical, achievable milestones with real project experience.
    Return ONLY valid JSON, no other text.
    """
    
    result = mistral_client.call_mistral(
        system_prompt=get_roadmap_prompt(),
        user_message=user_message
    )
    
    if result and 'short_term' in result:
        return {
            "success": True,
            "data": result
        }
    else:
        # Fallback response
        return {
            "success": True,
            "data": {
                "short_term": [
                    {
                        "goal": "Master System Design Fundamentals",
                        "duration": "3-4 weeks",
                        "resources": [
                            "System Design Interview course on Educative",
                            "Designing Data-Intensive Applications book",
                            "YouTube: Tech Dummies System Design"
                        ],
                        "projects": [
                            "Design a URL shortener service",
                            "Design a chat application backend"
                        ]
                    },
                    {
                        "goal": "AWS Fundamentals Certification",
                        "duration": "4-5 weeks",
                        "resources": [
                            "AWS Certified Cloud Practitioner course on Udemy",
                            "AWS Free Tier hands-on labs",
                            "A Cloud Guru practice exams"
                        ],
                        "projects": [
                            "Deploy a 3-tier web application on AWS",
                            "Set up CI/CD pipeline with CodePipeline"
                        ]
                    },
                    {
                        "goal": "Advanced Algorithm Practice",
                        "duration": "3-4 weeks",
                        "resources": [
                            "LeetCode Premium subscription",
                            "GeeksforGeeks Algorithm tutorials",
                            "Cracking the Coding Interview book"
                        ],
                        "projects": [
                            "Solve 50 medium-level problems on LeetCode",
                            "Implement common algorithms from scratch"
                        ]
                    }
                ],
                "medium_term": [
                    {
                        "goal": "Kubernetes and Container Orchestration",
                        "duration": "1.5-2 months",
                        "resources": [
                            "Kubernetes documentation and tutorials",
                            "KodeKloud Kubernetes course",
                            "Docker Deep Dive book"
                        ],
                        "projects": [
                            "Containerize a microservices application",
                            "Deploy to Kubernetes cluster",
                            "Set up monitoring with Prometheus"
                        ]
                    },
                    {
                        "goal": "Build a Microservices Project",
                        "duration": "2-3 months",
                        "resources": [
                            "Microservices Patterns book",
                            "Node.js + NestJS framework",
                            "gRPC and API Gateway tutorials"
                        ],
                        "projects": [
                            "Build 3-tier microservices application",
                            "Implement distributed tracing with Jaeger",
                            "Deploy with Docker and Kubernetes"
                        ]
                    },
                    {
                        "goal": "Advanced Database Design",
                        "duration": "1.5-2 months",
                        "resources": [
                            "Designing Data-Intensive Applications",
                            "PostgreSQL advanced features course",
                            "MongoDB for Developers course"
                        ],
                        "projects": [
                            "Design and optimize database schema",
                            "Implement sharding and replication",
                            "Performance tuning workshop"
                        ]
                    }
                ]
            }
        }
