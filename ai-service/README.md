# AI Career Guidance Service

Flask-based microservice that provides AI-powered career guidance using Mistral API.

## Quick Start

### 1. Setup Python Environment
```bash
python -m venv venv
source venv/Scripts/activate  # Windows
# or: source venv/bin/activate  # Mac/Linux
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Create .env File
```bash
echo "MISTRAL_API_KEY=YOUR_KEY_HERE" > .env
echo "FLASK_PORT=5000" >> .env
```

### 4. Run Service
```bash
python app.py
```

Service will be available at `http://localhost:5000`

## API Endpoints

### 1. Health Check
```
GET /health
```
Response: `{"status": "ok", "service": "ai-service"}`

### 2. Career Guidance
```
POST /career-guidance
Body: {
  "skills": ["Python", "JavaScript"],
  "interests": ["Web Dev", "AI"],
  "education": "2nd Year",
  "experience": "Internship"
}
```

### 3. Resume Analysis
```
POST /resume-analysis
Body: {
  "resumeText": "...",
  "career": "Software Engineer"
}
```

### 4. Interview Preparation
```
POST /interview-prep
Body: {
  "career": "Software Engineer",
  "resumeHighlights": "..."
}
```

### 5. Learning Roadmap
```
POST /learning-roadmap
Body: {
  "career": "Software Engineer",
  "skillGaps": ["System Design", "DevOps"]
}
```

## Features

- ✅ Mistral API integration
- ✅ CORS enabled for frontend
- ✅ Graceful fallbacks if API fails
- ✅ JSON request/response handling
- ✅ Error handling and logging
- ✅ Health check endpoint

## Deployment

For production:
```bash
gunicorn app:app --bind 0.0.0.0:5000
```

## Troubleshooting

**API Key Error**: Make sure MISTRAL_API_KEY is set in .env
**Connection Error**: Ensure Flask is running on port 5000
**CORS Error**: Check that CORS is properly configured

## Dependencies

- Flask 2.3.2
- flask-cors 4.0.0
- python-dotenv 1.0.0
- requests 2.31.0
- gunicorn 21.2.0
