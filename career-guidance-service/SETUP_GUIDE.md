# CareerNexus AI - Setup Guide

## 🚀 Overview

CareerNexus AI is an AI-powered Career Guidance module that analyzes student profiles and provides personalized career predictions, readiness scores, and 6-month action plans.

**Features:**
- ✅ Intelligent career prediction using RandomForestClassifier
- ✅ Career Readiness Score calculation
- ✅ Personalized 6-month roadmaps
- ✅ Downloadable PDF reports with analysis
- ✅ AI Career Chat Assistant
- ✅ Professional glassmorphic UI
- ✅ Fully responsive design

---

## 📋 Prerequisites

- Python 3.8+
- pip (Python package manager)
- Modern web browser

---

## ⚙️ Installation & Setup

### Step 1: Install Python Dependencies

```bash
cd career-guidance-service
pip install -r requirements.txt
```

### Step 2: Train the ML Model

The ML model must be trained before running the application.

```bash
python train_model.py
```

**Output:**
```
============================================================
CareerNexus AI - Model Training
============================================================
Dataset shape: (15, 13)
Features: ['Python', 'Java', 'SQL', 'ML', 'Communication', ...]
Target variable (Career): ['Data Analyst', 'ML Engineer', ...]

...

✓ Model saved: models/career_rf_model.pkl
✓ Scaler saved: models/scaler.pkl
✓ Feature names saved: models/feature_names.pkl
✓ Career classes saved: models/career_classes.pkl

Training Complete! ✓
```

> The script creates a `models/` folder with:
> - `career_rf_model.pkl` - Trained RandomForest model
> - `scaler.pkl` - StandardScaler for feature normalization
> - `feature_names.pkl` - Feature column names
> - `career_classes.pkl` - Career class labels

### Step 3: Run the Flask Backend

```bash
python app.py
```

**Expected Output:**
```
============================================================
CareerNexus AI - Flask Backend
============================================================
Starting server on http://127.0.0.1:5002
Endpoints:
  POST /assess - Career prediction
  POST /score - Readiness score calculation
  GET  /roadmap/<career> - Career roadmap
  POST /report - Generate PDF report
  POST /chat - Career chat assistant
============================================================
```

### Step 4: Open the Frontend

Open your browser and navigate to:
```
http://localhost:5002/
```

---

## 🎯 How to Use

### 1. Assessment Form
- Rate your technical skills (Python, Java, SQL, ML, Communication, Problem Solving)
- Select career interests (Data, Development, Management, Research, Design)
- Enter your academic CGPA
- Provide name and email

### 2. Results Dashboard
After submission, you'll see:
- **Primary Career Recommendation** with confidence percentage
- **Career Readiness Score** (0-100) with breakdown
- **Top 3 Career Suggestions**

### 3. Career Roadmap
View a personalized 6-month action plan specific to your predicted career.

### 4. Download Report
Generate and download a comprehensive PDF career report containing:
- Student profile summary
- Skill analysis
- Career predictions
- Readiness score analysis
- 6-month action plan

### 5. Chat with AI
Ask questions to the AI career advisor:
- "Why is this career suitable for me?"
- "How can I improve my score?"
- "What jobs can I apply for?"

---

## 📚 ML Model Explanation

### Algorithm: Random Forest Classifier

**Why Random Forest?**
1. Handles non-linear relationships between skills and careers
2. Provides feature importance rankings
3. Robust to outliers and missing patterns
4. Natural probability estimates for confidence scores
5. No requirement for feature scaling (but we do it for consistency)

### Feature Engineering

**Input Features (12 total):**
- **Technical Skills (1-5 scale):** Python, Java, SQL, ML
- **Soft Skills (1-5 scale):** Communication, Problem Solving
- **Career Interests (0-100 scale):** Data, Development, Management, Research, Design
- **Academic:** CGPA (0-10)

**Preprocessing:**
1. StandardScaler normalization for consistent feature ranges
2. Training set: 80% of data (12 samples)
3. Test set: 20% of data (3 samples)

### Career Readiness Score Formula

```
Readiness Score = 
  (Skills Match × 0.40) +
  (Academic Score × 0.30) +
  (Interest Alignment × 0.30)
```

**Color Coding:**
- 🔴 < 40: Needs Improvement
- 🟡 40-70: On Track
- 🟢 > 70: Career Ready

---

## 📊 Supported Careers

1. **Data Analyst** - SQL, Python, Business Analytics
2. **ML Engineer** - Deep Learning, Python, TensorFlow
3. **Full Stack Developer** - React, Node.js, Databases
4. **Data Scientist** - Statistics, ML, Research
5. **Frontend Developer** - React, CSS, JavaScript
6. **Business Analyst** - Excel, Data, Strategy
7. **Project Manager** - Agile, Leadership, Communication

---

## 🔌 API Endpoints

### POST /assess
Career prediction based on user input.

**Request:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "Python": 4,
    "Java": 3,
    "SQL": 5,
    "ML": 5,
    "Communication": 4,
    "ProblemSolving": 5,
    "Data_Interest": 90,
    "Development_Interest": 60,
    "Management_Interest": 40,
    "Research_Interest": 85,
    "Design_Interest": 35,
    "CGPA": 8.5
}
```

**Response:**
```json
{
    "success": true,
    "primary_career": "ML Engineer",
    "confidence": 87.5,
    "top_3_careers": [
        {"career": "ML Engineer", "confidence": 87.5},
        {"career": "Data Scientist", "confidence": 12.3},
        {"career": "Data Analyst", "confidence": 0.2}
    ],
    "skills_match": 85,
    "timestamp": "2024-01-31T10:30:00"
}
```

### POST /score
Calculate Career Readiness Score.

**Request:**
```json
{
    "Python": 4,
    "Java": 3,
    ...all assessment data...,
    "predicted_career": "ML Engineer"
}
```

**Response:**
```json
{
    "success": true,
    "readiness_score": 78.5,
    "status": "Career Ready",
    "color": "green",
    "breakdown": {
        "skills_match": 85,
        "academic_score": 85,
        "interest_alignment": 85
    }
}
```

### GET /roadmap/<career>
Get 6-month career roadmap.

**Example:** `GET /roadmap/ML Engineer`

**Response:**
```json
{
    "success": true,
    "career": "ML Engineer",
    "duration": "6 months",
    "steps": [
        {
            "month": "Month 1-2",
            "focus": "Deep Learning Fundamentals",
            "actions": [
                "Master TensorFlow & PyTorch",
                "Complete neural network basics",
                "Build 3 CNN projects",
                "Understand backpropagation theory"
            ]
        },
        ...more steps...
    ]
}
```

### POST /report
Generate PDF career report.

**Request:** Same as /assess endpoint

**Response:** PDF file download

### POST /chat
AI Career Chat Assistant.

**Request:**
```json
{
    "question": "Why is this career suitable for me?",
    "career": "ML Engineer",
    "user_data": {...full assessment data...}
}
```

**Response:**
```json
{
    "success": true,
    "question": "Why is this career suitable for me?",
    "response": "You're perfect for ML Engineer with your Python expertise...",
    "career": "ML Engineer"
}
```

---

## 📁 Project Structure

```
career-guidance-service/
├── app.py                 # Flask backend with all API endpoints
├── train_model.py        # ML model training script
├── career_roadmap.py     # Career roadmap data
├── pdf_generator.py      # PDF report generation
├── requirements.txt      # Python dependencies
├── models/               # Saved ML models
│   ├── career_rf_model.pkl
│   ├── scaler.pkl
│   ├── feature_names.pkl
│   └── career_classes.pkl
├── templates/
│   └── index.html        # Frontend HTML
└── static/
    ├── style.css         # Styling
    └── script.js         # Frontend JavaScript
```

---

## 🧪 Testing the API

### Using curl

```bash
# Test assessment endpoint
curl -X POST http://localhost:5002/assess \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "Python": 4,
    "Java": 3,
    "SQL": 5,
    "ML": 5,
    "Communication": 4,
    "ProblemSolving": 5,
    "Data_Interest": 90,
    "Development_Interest": 60,
    "Management_Interest": 40,
    "Research_Interest": 85,
    "Design_Interest": 35,
    "CGPA": 8.5
  }'

# Test readiness score
curl -X POST http://localhost:5002/score \
  -H "Content-Type: application/json" \
  -d '{...same data plus "predicted_career": "ML Engineer"...}'

# Test roadmap
curl http://localhost:5002/roadmap/ML%20Engineer

# Test chat
curl -X POST http://localhost:5002/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Why is this career suitable for me?",
    "career": "ML Engineer",
    "user_data": {...assessment data...}
  }'
```

---

## 🎓 Model Training Details

The training script includes:

1. **Sample Dataset:** 15 student profiles across 7 careers
2. **Features:** 12 input features (skills, interests, CGPA)
3. **Algorithm:** RandomForestClassifier with 100 trees
4. **Train/Test Split:** 80/20 with stratification
5. **Metrics Reported:**
   - Training Accuracy
   - Test Accuracy
   - Classification Report
   - Feature Importance Ranking

### Customize Training Data

Edit `train_model.py` to add more training samples:

```python
training_data = {
    'Python': [4, 5, 3, ...more values...],
    'Java': [3, 4, 5, ...more values...],
    ...
    'Career': ['Data Analyst', 'ML Engineer', ...]
}
```

Then rerun: `python train_model.py`

---

## 🐛 Troubleshooting

### Error: "Models not found"
**Solution:** Run `python train_model.py` first to generate model files.

### Error: "CORS policy blocked"
**Solution:** Flask-CORS is already configured. Make sure frontend is on correct origin.

### Error: "Port 5002 already in use"
**Solution:** 
```bash
# Find process using port 5002
lsof -i :5002
# Kill process
kill -9 <PID>
```

### Model predictions seem off
**Solution:** The sample training data is limited (15 samples). Add more diverse training data for better accuracy.

---

## 🚀 Deployment

### Using Gunicorn (Production)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5002 app:app
```

### Using Docker

Create `Dockerfile`:
```dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t careernexus-ai .
docker run -p 5002:5002 careernexus-ai
```

---

## 📄 License

Built for hackathon purposes. Free to use and modify.

---

## ✨ Features Implemented

- ✅ Random Forest ML model with joblib persistence
- ✅ Smart assessment form with 6+ parameters
- ✅ Career prediction with confidence scores
- ✅ Readiness score calculation with formula
- ✅ 6-month personalized roadmaps
- ✅ PDF report generation
- ✅ Rule-based AI chat assistant
- ✅ Professional glassmorphic UI
- ✅ Responsive mobile design
- ✅ Smooth animations and transitions
- ✅ Chart.js integration ready
- ✅ Full API documentation

---

## 📞 Support

For issues or questions, check the troubleshooting section or review the code comments.

Happy Career Planning! 🎯
