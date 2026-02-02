# NEXUS AI - Career Guidance Backend Integration

Complete microservices architecture for AI-powered career guidance using Mistral API.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ Frontend (React)                                                 │
│ Port: 5174                                                      │
│ - Dashboard (displays AI recommendations)                        │
│ - Fetches /api/career/* endpoints                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP POST/GET requests
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Node.js Backend (Express)                                        │
│ Port: 5001                                                      │
│ - /api/career/career (orchestrator)                            │
│ - /api/career/resume                                            │
│ - /api/career/interview                                         │
│ - /api/career/roadmap                                           │
│ - /api/career/full-report                                       │
│ - Authenticates requests                                         │
│ - Calls Flask AI Service internally                             │
│ - Saves results to MongoDB                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Internal HTTP calls
                    (localhost:5000)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Python Flask AI Service                                          │
│ Port: 5000                                                      │
│ - /career-guidance (AI processing)                             │
│ - /resume-analysis (AI processing)                             │
│ - /interview-prep (AI processing)                              │
│ - /learning-roadmap (AI processing)                            │
│ - /career-report (combines all above)                          │
│ - Calls Mistral API                                             │
│ - Returns structured JSON responses                             │
│ - Fallback responses for demo stability                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    API requests with Bearer token
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Mistral API                                                      │
│ Model: mistral-small-latest                                     │
│ - Provides AI intelligence for all recommendations              │
│ - Uses Bearer token authentication                              │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
ai-service/
├── app.py                      # Flask application with 5 endpoints
├── mistral_client.py           # Core Mistral API communication
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables
├── agents/
│   ├── __init__.py
│   ├── career_agent.py         # Career recommendation engine
│   ├── resume_agent.py         # Resume analysis engine
│   ├── interview_agent.py      # Interview prep engine
│   └── roadmap_agent.py        # Learning roadmap engine
└── prompts/                    # Prompt templates (optional)
```

## Setup Instructions

### 1. Python Environment Setup

```bash
# Navigate to ai-service directory
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Variables

Create `.env` file in `ai-service` directory:

```env
MISTRAL_API_KEY=your_mistral_api_key_here
FLASK_PORT=5000
FLASK_ENV=development
```

**Get Mistral API Key:**
1. Visit https://console.mistral.ai
2. Create account or login
3. Generate API key
4. Add to `.env` file

### 3. Start Flask AI Service

```bash
# From ai-service directory
python app.py

# Output:
# * Running on http://0.0.0.0:5000
# * Mistral API Key configured: True
```

### 4. Verify Node.js Backend Configuration

The Node.js backend is already configured to call the Flask service at `http://localhost:5000`.

In `backend/src/routes/careerGuidanceRoutes.js`:
```javascript
const FLASK_AI_SERVICE_URL = process.env.FLASK_AI_SERVICE_URL || 'http://localhost:5000';
```

### 5. Test the API Endpoints

#### Health Check

```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "healthy",
  "service": "NEXUS AI Career Guidance Service",
  "version": "1.0.0"
}
```

#### Career Guidance

```bash
curl -X POST http://localhost:5000/career-guidance \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["Python", "React", "System Design"],
    "interests": ["AI", "Web Development"],
    "academics": "B.Tech Computer Science",
    "goals": "Build AI solutions at scale"
  }'
```

#### Resume Analysis

```bash
curl -X POST http://localhost:5000/resume-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Your resume content here...",
    "target_career": "Software Engineer"
  }'
```

#### Interview Preparation

```bash
curl -X POST http://localhost:5000/interview-prep \
  -H "Content-Type: application/json" \
  -d '{
    "career": "Software Engineer",
    "skill_gaps": ["System Design", "AWS"]
  }'
```

#### Learning Roadmap

```bash
curl -X POST http://localhost:5000/learning-roadmap \
  -H "Content-Type: application/json" \
  -d '{
    "career": "Software Engineer",
    "skill_gaps": ["System Design", "AWS", "Kubernetes"]
  }'
```

## Node.js Routes

After Flask service is running, test Node.js routes with authentication:

### Prerequisites

1. Get a valid JWT token by logging in through the frontend or auth endpoint
2. Replace `YOUR_JWT_TOKEN` with actual token

### Test Routes

```bash
# Career Guidance
curl -X POST http://localhost:5001/api/career/career \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "skills": ["Python", "React"],
    "interests": ["AI"],
    "academics": "B.Tech",
    "goals": "Build AI systems"
  }'

# Resume Analysis
curl -X POST http://localhost:5001/api/career/resume \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "resumeText": "...",
    "targetCareer": "Software Engineer"
  }'

# Interview Preparation
curl -X POST http://localhost:5001/api/career/interview \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "career": "Software Engineer",
    "skillGaps": ["System Design"]
  }'

# Learning Roadmap
curl -X POST http://localhost:5001/api/career/roadmap \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "career": "Software Engineer",
    "skillGaps": ["AWS", "Kubernetes"]
  }'

# Full Report
curl -X POST http://localhost:5001/api/career/full-report \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "skills": ["Python", "React"],
    "interests": ["AI"],
    "academics": "B.Tech",
    "goals": "Build AI systems",
    "resumeText": "...",
    "skillGaps": ["System Design"]
  }'

# Get Report
curl http://localhost:5001/api/career/report \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Health Check
curl http://localhost:5001/api/career/health
```

## API Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "career": "Software Engineer",
    "confidence": 85,
    "reason": "Your technical skills align well...",
    "priority_skills": ["System Design", "Python", "Cloud"],
    "actions": ["Action 1: Description", "Action 2: Description"]
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error description"
}
```

### Fallback Response

When Mistral API is unavailable, the service returns a realistic fallback response with the same structure as above to ensure demo stability.

## Key Features

✅ **Mistral AI Integration**
- Uses `mistral-small-latest` model
- Temperature: 0.7 (balanced creativity/determinism)
- Max tokens: 1024 (sufficient for detailed responses)
- 30-second timeout with error handling

✅ **Four AI Agents**
- **Career Agent**: Analyzes skills, interests, academics, goals → Recommends career path with confidence score
- **Resume Agent**: Reviews resume against target career → Provides strengths, weaknesses, suggestions
- **Interview Agent**: Generates interview questions → Provides sample answers and tips
- **Roadmap Agent**: Creates learning path → Provides short-term and medium-term goals

✅ **Fallback Responses**
- All agents have hardcoded fallback responses
- Fallbacks have identical JSON structure to Mistral responses
- Ensures demo stability when API is unavailable
- Returns realistic, credible recommendations

✅ **Error Handling**
- Request timeout: 60 seconds
- API timeout: 30 seconds
- JSON parsing with regex fallback: `\{.*\}`
- Graceful error messages for frontend

✅ **Security**
- Bearer token authentication (Mistral API)
- JWT authentication (Node.js routes)
- CORS enabled for localhost:5174
- Request validation

## Data Flow Example

### User Request → Recommendation

```
1. Frontend: User submits skills, interests, academics, goals
2. Frontend: POST /api/career/career with JWT token
3. Node.js: Authenticates request, extracts userId
4. Node.js: Calls Flask http://localhost:5000/career-guidance
5. Flask: Calls Mistral API with system prompt + user message
6. Mistral: Returns JSON with career recommendation
7. Flask: Returns {"success": true, "data": {...}} to Node.js
8. Node.js: [TODO] Saves to MongoDB, returns to frontend
9. Frontend: Displays recommendation in dashboard
```

## Database Models (To Be Created)

```javascript
// CareerResult
{
  userId: ObjectId,
  career: String,
  confidence: Number,
  reason: String,
  priority_skills: [String],
  actions: [String],
  createdAt: Date
}

// ResumeAnalysis
{
  userId: ObjectId,
  strengths: [String],
  weaknesses: [String],
  missing_skills: [String],
  suggestions: [String],
  createdAt: Date
}

// InterviewPrep
{
  userId: ObjectId,
  questions: [{
    question: String,
    category: String,
    sample_answer: String
  }],
  tips: [String],
  createdAt: Date
}

// LearningRoadmap
{
  userId: ObjectId,
  short_term: [{
    goal: String,
    duration: String,
    resources: [String],
    projects: [String]
  }],
  medium_term: [{
    goal: String,
    duration: String,
    resources: [String],
    projects: [String]
  }],
  createdAt: Date
}
```

## Frontend Integration (TODO)

The frontend dashboard components are ready to display data. Replace static values with API calls:

```javascript
// Example: CareerGuidanceCard.jsx
const [careerData, setCareerData] = useState(null);

useEffect(() => {
  const fetchCareerGuidance = async () => {
    const response = await fetch('/api/career/career', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        skills: userProfile.skills,
        interests: userProfile.interests,
        academics: userProfile.academics,
        goals: userProfile.goals
      })
    });
    
    const data = await response.json();
    if (data.success) {
      setCareerData(data.data);
    }
  };
  
  fetchCareerGuidance();
}, [userProfile]);

return (
  <div>
    <h3>{careerData?.career}</h3>
    <p>Confidence: {careerData?.confidence}%</p>
    <p>{careerData?.reason}</p>
  </div>
);
```

## Troubleshooting

### Flask Service Not Starting

```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000  # macOS/Linux

# Check if dependencies are installed
pip list | grep Flask

# Verify Mistral API key
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('MISTRAL_API_KEY'))"
```

### Mistral API Errors

```bash
# Test API directly
curl https://api.mistral.ai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "mistral-small-latest", "messages": [{"role": "user", "content": "Hello"}]}'
```

### Node.js Cannot Connect to Flask

```bash
# Verify Flask is running
curl http://localhost:5000/health

# Check firewall settings
# Ensure localhost:5000 is accessible from Node.js

# Check environment variable
echo $FLASK_AI_SERVICE_URL  # Should be http://localhost:5000
```

## Performance Optimization

### Current Configuration

- Temperature: 0.7 (balanced)
- Max tokens: 1024 (sufficient)
- Timeout: 30s (Mistral), 60s (Node.js)

### For Faster Responses

```python
# In mistral_client.py
payload = {
    'temperature': 0.5,  # Lower = more deterministic
    'max_tokens': 512,   # Shorter responses
}
```

### For More Creative Responses

```python
payload = {
    'temperature': 0.9,  # Higher = more creative
    'max_tokens': 2048,  # Longer responses
}
```

## Monitoring

### Flask Service Logs

```bash
# Enable detailed logging
export FLASK_ENV=development
python app.py

# Check logs for:
# - Mistral API calls
# - Request/response times
# - Error messages
```

### Node.js Service Logs

```bash
# Check backend logs for:
# - Route execution
# - Flask API calls
# - Error messages
```

## Next Steps

1. ✅ Flask AI service with 4 agents
2. ✅ Mistral API integration
3. ✅ Node.js route orchestration
4. ⏳ Database models (Mongoose)
5. ⏳ Save AI results to MongoDB
6. ⏳ Frontend API binding
7. ⏳ Caching for performance
8. ⏳ Rate limiting
9. ⏳ Analytics tracking

## Support

For issues or questions:
1. Check logs for error messages
2. Verify Mistral API key is valid
3. Ensure both services (Flask and Node.js) are running
4. Test endpoints with curl before frontend integration
5. Check MongoDB connection for saving results

---

**Last Updated**: January 2024
**Version**: 1.0.0 - Backend Dynamic Integration Complete
