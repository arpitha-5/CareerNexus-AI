# 🚀 CareerNexus App - Complete Documentation

![CareerNexus Banner]()

**CareerNexus** is an innovative AI-powered career guidance and skill development platform built with modern technologies. It provides personalized career recommendations, skill assessments, learning roadmaps, and comprehensive career analytics for users seeking professional growth.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [System Architecture](#system-architecture)
5. [Project Structure](#project-structure)
6. [Prerequisites](#prerequisites)
7. [Installation & Setup](#installation--setup)
8. [Running the Application](#running-the-application)
9. [API Endpoints](#api-endpoints)
10. [Database Setup](#database-setup)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)
13. [Development Team](#development-team)
14. [Contributing](#contributing)
15. [License](#license)

---

## 📌 Project Overview

**CareerNexus** is a comprehensive career development platform designed to help professionals and students:

- **Assess Skills**: Take interactive skill assessments across multiple domains
- **Get AI-Powered Recommendations**: Receive personalized career path suggestions
- **Analyze Interests**: Understand career interests and aptitudes through psychological analysis
- **Learn & Grow**: Access customized learning roadmaps with structured skill development plans
- **Track Progress**: Monitor skill development and career growth over time
- **Download Reports**: Generate and download comprehensive career reports for reference
- **Professional Dashboard**: View analytics, recommendations, and career insights in real-time

This application combines **React Native** with **Expo** for cross-platform mobile development and a robust **Node.js/Express** backend with **SQLite** database.

---

## ✨ Features

### 🎯 Core Features

1. **User Authentication**
   - Secure registration and login system
   - JWT-based authentication
   - Profile management with image uploads
   - Password encryption with bcryptjs

2. **Skill Assessment**
   - Multi-domain skill evaluation
   - Proficiency level tracking (Beginner, Intermediate, Advanced, Expert)
   - Skill suggestion system
   - Performance analytics

3. **Career Recommendations**
   - AI-powered career path suggestions
   - Personalized recommendations based on skills
   - Career compatibility analysis
   - Multiple career option exploration

4. **Interest Analysis**
   - Psychological interest assessment
   - Career interest mapping
   - Interest-based career matching
   - Interest trend analysis

5. **Learning Roadmap Generator**
   - Customized skill development paths
   - Step-by-step learning progression
   - Recommended resources and courses
   - Timeline-based learning schedules

6. **Dashboard Analytics**
   - Real-time user statistics
   - Skill progress visualization
   - Career recommendation display
   - Quick access to all features

7. **Report Generation & Download**
   - Comprehensive career reports
   - PDF export functionality
   - Career analysis documents
   - Shareable professional reports

8. **Help & Support**
   - In-app help documentation
   - FAQ section
   - User guides
   - Support contact information
  
9. **Skill Gap Engine**
   - Dynamic comparison between user skills and target job role requirements
   - Identification of missing, weak, and strong skills
   - Priority-based skill gap classification
   - Role-specific skill gap insights
  
10. **Adaptive Learning Path**
    - Learning paths generated based on resume analysis and skill gaps
    - Automatic recalculation when skills or goals change
    - Dependency-aware skill sequencing
    - Personalized weekly learning plans

11. **Resume Analyzer**
    - AI-powered resume evaluation
    - ATS friendliness assessment
    - Strengths and weaknesses detection
    - Resume improvement suggestions aligned with career goals

12. **Interview Preparation Assistant**
    - Role-specific interview questions
    - Company-focused interview preparation
    - AI-generated ideal answers and improvement feedback
    - Interview readiness insights

13. **Recruiter Shortlist Simulator**
    - Simulates recruiter screening behavior
    - Resume screening score
    - Skill match and project relevance evaluation
    - Shortlisted / Borderline / Rejected verdict with explanation

14. **Career Risk & Stability Analyzer**
    - Market demand and saturation analysis
    - Automation and future-risk evaluation
    - Career longevity insights
    - Realistic risk assessment for informed decision-making

15. **Placement Readiness Score**
    - Unified readiness metric combining skills, resume, and interview prep
    - Progress-based readiness tracking
    - Actionable recommendations to improve readiness

---

## 🏗️ Tech Stack

### **Frontend (Mobile Application)**
- **Framework**: React Native 0.81.5
- **Development Framework**: Expo 54.0.33 with Expo Router 6.0.23
- **Navigation**: React Navigation
  - Bottom Tab Navigator
  - Native Stack Navigator
  - Tab-based navigation structure
- **UI Components**:
  - Expo Vector Icons (Material Community Icons)
  - Linear Gradient (expo-linear-gradient)
  - Image handling with expo-image
  - Safe Area Context for device compatibility
- **Storage**: AsyncStorage for local data persistence
- **Platform Support**: 
  - iOS (with tablet support)
  - Android (with adaptive icons and edge-to-edge display)
  - Web (static output)
- **Languages**: TypeScript, JavaScript, React JSX
- **Build Tool**: EAS Build system
- **Version**: 1.0.0

### **Backend (API Server)**
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.0
- **Database**: SQLite (better-sqlite3) - Local embedded database
- **Authentication**: 
  - JSON Web Tokens (JWT) 9.0.0
  - bcryptjs 2.4.3 (password hashing)
- **File Uploads**: Multer 2.0.2
- **CORS**: Cross-Origin Resource Sharing support
- **Environment Variables**: dotenv 16.0.0
- **Development Tool**: Nodemon (auto-reload during development)
- **Version**: 1.0.0

### **Deployment**
- **Hosting Platform**: Render.com (Cloud platform for Node.js apps)
- **Backend URL**: https://career-backend-p085.onrender.com
- **Database**: SQLite (portable, no external database required)

### **Development Tools**
- **Version Control**: Git
- **Package Manager**: npm
- **Linting**: ESLint 9.25.0 with Expo config
- **TypeScript**: 5.9.2
- **Scripting**: PowerShell (Windows automation scripts)

---

## 🏛️ System Architecture

### **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                    USER DEVICES                               │
│  (iOS, Android, Web - via Expo)                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTP/HTTPS Requests
                  │ (AsyncStorage for offline data)
                  │
┌─────────────────▼───────────────────────────────────────────┐
│          EXPO FRONTEND APPLICATION                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Screens:                                            │   │
│  │  • Landing (App intro & onboarding)                │   │
│  │  • Login/Registration (Auth)                        │   │
│  │  • Dashboard (Main hub & statistics)               │   │
│  │  • Skill Assessment (Interactive tests)            │   │
│  │  • Interest Analysis (Psychology-based assessment) │   │
│  │  • Career Recommendation (AI suggestions)          │   │
│  │  • Learning Roadmap (Structured learning paths)    │   │
│  │  • Report View (View generated reports)            │   │
│  │  • Report Download (PDF export)                    │   │
│  │  • Profile (User info & settings)                  │   │
│  │  • Help & Support (Documentation)                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ REST API Calls (port 5000)
                  │
┌─────────────────▼───────────────────────────────────────────┐
│          EXPRESS.JS BACKEND SERVER                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Endpoints:                                     │   │
│  │  • /api/auth/register (User registration)         │   │
│  │  • /api/auth/login (User login & token gen)       │   │
│  │  • /api/auth/profile (Get/update user profile)    │   │
│  │  • /api/auth/upload-image (Profile image upload)  │   │
│  │  • /api/skills/* (Skill management)               │   │
│  │  • /api/recommendations/* (Career recommendations)│   │
│  │  • /api/assessment/* (Skill assessments)          │   │
│  │  • /api/roadmap/* (Learning roadmaps)             │   │
│  │  • /api/health (Server health check)              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  Middleware:                                                │
│  • CORS (Cross-origin resource sharing)                     │
│  • JWT Authentication                                       │
│  • Multer (File upload handling)                            │
│  • Error handling & validation                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ SQL Queries
                  │
┌─────────────────▼───────────────────────────────────────────┐
│          SQLITE DATABASE                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Tables:                                             │   │
│  │  • users (id, name, email, password, profile_image)│   │
│  │  • user_skills (id, user_id, skill_name, prof_lvl) │   │
│  │  • assessments (user responses to skill tests)      │   │
│  │  • learning_paths (customized roadmaps)            │   │
│  │  • recommendations (career suggestions)             │   │
│  └─────────────────────────────────────────────────────┘   │
│  File: careernexus.db (local SQLite database)               │
└──────────────────────────────────────────────────────────────┘
```

### **Data Flow**

```
User Action (Mobile App)
        ↓
Form Submission / Button Click
        ↓
AsyncStorage (Cache locally)
        ↓
HTTP Request to Backend
        ↓
Express Middleware (Auth, Validation)
        ↓
Database Query (SQLite)
        ↓
Response Processing
        ↓
Update UI State (React)
        ↓
User Sees Results
```

### **Authentication Flow**

```
1. Registration:
   User → App → Backend
   ✓ Hash password (bcryptjs)
   ✓ Store in database
   ✓ Return success response

2. Login:
   User → App → Backend
   ✓ Verify credentials
   ✓ Generate JWT token
   ✓ Return token to app

3. Authenticated Requests:
   App → Backend (with JWT in header)
   ✓ Verify token
   ✓ Process request
   ✓ Return user-specific data
```

---

## 📁 Project Structure

```
Career-Nexus-App/
├── 📄 README.md                          # Main documentation (this file)
├── 📄 README_FIRST.txt                   # Quick start guide
├── 📄 MONGODB_SETUP.md                   # Database configuration guide
├── 📄 VERIFICATION_CHECKLIST.txt         # Setup verification checklist
├── 📄 package.json                       # Frontend dependencies
├── 📄 tsconfig.json                      # TypeScript configuration
├── 📄 eslint.config.js                   # Linting rules
├── 📄 app.json                           # Expo app configuration
├── 📄 eas.json                           # Expo Application Services config
├── 📄 index.js                           # App entry point
├── 📄 expo-env.d.ts                      # TypeScript environment definitions
│
├── 📂 app/                               # Expo Router navigation
│   ├── _layout.tsx                       # Root layout
│   ├── modal.tsx                         # Modal screen
│   └── (tabs)/                           # Tab-based navigation
│       ├── _layout.tsx                   # Tab layout configuration
│       ├── index.tsx                     # Home tab
│       └── explore.tsx                   # Explore tab
│
├── 📂 screens/                           # Application screens
│   ├── Landing.jsx                       # Onboarding & introduction
│   ├── Login.jsx                         # User authentication
│   ├── Dashboard.jsx                     # Main dashboard (2000+ lines)
│   ├── Profile.jsx                       # User profile management
│   ├── SkillAssessment.jsx               # Interactive skill tests
│   ├── InterestAnalysis.jsx              # Interest-based career analysis
│   ├── CareerRecommendation.jsx          # AI career suggestions
│   ├── LearningRoadmap.jsx               # Learning path generator
│   ├── RoadmapGenerator.jsx              # Roadmap creation logic
│   ├── ReportView.jsx                    # View generated reports
│   ├── ReportDownload.jsx                # PDF export functionality
│   └── Help.jsx                          # Help & support section
│
├── 📂 components/                        # Reusable React components
│   ├── AppHeader.jsx                     # App header component
│   ├── BrandingHeader.jsx                # Branding display component
│   ├── CommonComponents.jsx              # Card, Button, Modal components
│   ├── external-link.tsx                 # External link handler
│   ├── haptic-tab.tsx                    # Haptic feedback on tabs
│   ├── hello-wave.tsx                    # Wave animation component
│   ├── parallax-scroll-view.tsx          # Parallax scrolling
│   ├── themed-text.tsx                   # Theme-aware text component
│   ├── themed-view.tsx                   # Theme-aware view component
│   └── ui/                               # UI-specific components
│       ├── collapsible.tsx               # Collapsible sections
│       ├── icon-symbol.tsx               # Icon component
│       └── icon-symbol.ios.tsx           # iOS-specific icon
│
├── 📂 constants/                         # App constants
│   └── theme.ts                          # Color & styling constants
│
├── 📂 hooks/                             # Custom React hooks
│   ├── use-color-scheme.ts               # Color scheme detection
│   ├── use-color-scheme.web.ts           # Web-specific color scheme
│   └── use-theme-color.ts                # Theme color hook
│
├── 📂 assets/                            # Static assets
│   └── images/                           # App icons & images
│       ├── icon.png                      # App icon
│       ├── android-icon-*.png            # Android icons
│       └── favicon.png                   # Web favicon
│
├── 📂 scripts/                           # Utility scripts
│   └── reset-project.js                  # Project reset utility
│
├── 🖥️ START_ALL.ps1                      # PowerShell script (start all services)
├── 🖥️ START_APP.bat                      # Batch script (start app on Windows)
├── 🖥️ TEST_BACKEND.bat                   # Backend connectivity test
│
└── 📂 career-backend/                    # Backend API server
    ├── 📄 server.js                      # Express app (800+ lines)
    ├── 📄 package.json                   # Backend dependencies
    ├── 📄 README.md                      # Backend documentation
    ├── 📄 render.yaml                    # Render deployment config
    ├── 📄 start.ps1                      # PowerShell backend startup
    ├── 📄 START_BACKEND.bat              # Windows batch startup
    ├── 📄 test-server.js                 # Server testing utility
    ├── 📄 diagnose.js                    # Diagnostic tool
    ├── 📄 .env                           # Environment variables (gitignored)
    ├── 📄 .gitignore                     # Git ignore patterns
    │
    ├── 📦 node_modules/                  # Backend dependencies (npm packages)
    ├── 💾 careernexus.db                 # SQLite database file
    ├── 📂 uploads/                       # User profile image uploads
    └── 📂 .git/                          # Git repository
```

---

## 🛠️ Prerequisites

Before you can run CareerNexus, ensure you have the following installed:

### **Required Software**

1. **Node.js & npm**
   - Download: https://nodejs.org/
   - Recommended: LTS version (18.x or higher)
   - Verify: `node --version` and `npm --version`

2. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

3. **Expo CLI** (for mobile development)
   - Install: `npm install -g expo-cli`
   - Verify: `expo --version`

4. **Expo Go Mobile App** (for testing on device)
   - Download from App Store (iOS) or Google Play (Android)
   - Free to download and use

5. **Code Editor**
   - Recommended: Visual Studio Code (https://code.visualstudio.com/)
   - Extensions recommended: ES7+ React/Redux, Prettier, Thunder Client

6. **Database** (Choose one):
   - **Option A**: SQLite (comes bundled with backend)
   - **Option B**: MongoDB Atlas (cloud database) - optional

### **System Requirements**

- **OS**: Windows, macOS, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 2GB free space
- **Internet**: Required for cloud deployment and API calls

### **Ports Required**

- Port 5000: Backend Express server
- Port 8081 (default): Expo development server
- Port 27017: MongoDB (if using local MongoDB)

---

## 📦 Installation & Setup

### **Step 1: Clone the Repository**

```bash
# Using Git
git clone https://github.com/arpitha-5/CareerNexus-AI
cd CareerNexus-AI

# Or download as ZIP and extract
```

### **Step 2: Install Frontend Dependencies**

```bash
# In root directory
npm install

# Or install specific packages:
npm install expo@54.0.33
npm install expo-router@6.0.23
npm install react-native@0.81.5
```

### **Step 3: Install Backend Dependencies**

```bash
# Navigate to backend directory
cd career-backend

# Install dependencies
npm install

# Install specific packages:
npm install express@4.18.0
npm install mongoose@7.0.0 (optional, for MongoDB)
npm install bcryptjs@2.4.3
npm install jsonwebtoken@9.0.0

# Return to root
cd ..
```

### **Step 4: Setup Environment Variables**

#### **Backend .env file**

Create `career-backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=careernexus-development-secret-key-change-in-production

# Database Configuration (Choose one):
# Option A: Local SQLite (default)
DATABASE_TYPE=sqlite

# Option B: MongoDB Atlas (if using MongoDB)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/careernexus

# Optional: For file uploads
MAX_UPLOAD_SIZE=10mb
UPLOAD_DIR=./uploads
```

### **Step 5: Initialize Database**

```bash
# The SQLite database (careernexus.db) is created automatically
# when you first start the backend server

# Database tables are created automatically in server.js
```

### **Step 6: Verify Installation**

```bash
# Test backend installation
cd career-backend
npm start
# You should see: "✅ Server running on http://localhost:5000"

# In new terminal, test frontend
cd ..
npm start
# You should see Expo QR code and connection options
```

---

## 🚀 Running the Application

### **Option 1: Start Everything at Once (Windows)**

```powershell
# Using PowerShell script
.\START_ALL.ps1

# Or using batch file
.\START_APP.bat
```

### **Option 2: Manual Start (All Platforms)**

#### **Terminal 1: Start Backend Server**

```bash
cd career-backend
npm start

# Expected output:
# 📦 Using SQLite database at: C:\...\careernexus.db
# ✅ Server is running on http://localhost:5000
# 🚀 Backend ready!
```

#### **Terminal 2: Start Frontend/Expo**

```bash
# From root directory
npm start

# You'll see:
# › Metro waiting on exp://YOUR_IP:8081
# 
# Press 'w' for web
# Press 'a' for Android emulator
# Press 'i' for iOS simulator
# Scan QR code with Expo Go app
```

#### **Terminal 3: Start MongoDB (if needed)**

```powershell
# Windows PowerShell
Start-Service MongoDB

# Or check status
Get-Service MongoDB | Select-Object Status
```

### **Option 3: Running on Different Platforms**

#### **Web Browser**

```bash
npm start
# Press 'w' in terminal
# Opens http://localhost:19006 in browser
```

#### **Android Emulator**

```bash
npm start
# Press 'a' in terminal
# Make sure Android Studio is running with emulator active
```

#### **iOS Simulator** (macOS only)

```bash
npm start
# Press 'i' in terminal
```

#### **Physical Device**

```bash
# 1. Download Expo Go from App Store / Google Play
# 2. Run: npm start
# 3. Scan the QR code with Expo Go
# 4. App loads on your device
```

### **Development Mode**

```bash
# Frontend with hot reload
npm start

# Backend with auto-restart (nodemon)
cd career-backend
npm run dev
```

### **Testing Backend Connectivity**

```bash
# Quick test using batch file (Windows)
.\TEST_BACKEND.bat

# Or manual test
curl http://localhost:5000/api/health

# Expected response:
# {"status":"Server is running"}
```

---

## 🔌 API Endpoints

### **Base URL**
- **Local Development**: `http://localhost:5000/api`
- **Production**: `https://career-backend-p085.onrender.com/api`

### **Authentication Endpoints**

#### **1. Register User**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}

Response (200):
{
  "message": "User registered successfully",
  "userId": 1,
  "email": "john@example.com"
}
```

#### **2. Login User**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### **3. Get User Profile**
```
GET /api/auth/profile
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "profile_image": null,
  "created_at": "2026-02-04T10:30:00Z"
}
```

#### **4. Update User Profile**
```
PUT /api/auth/profile
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}

Response (200):
{
  "message": "Profile updated successfully"
}
```

#### **5. Upload Profile Image**
```
POST /api/auth/upload-image
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

[Form data with file: profile_image]

Response (200):
{
  "message": "Image uploaded successfully",
  "imageUrl": "/uploads/user_1_profile.jpg"
}
```

### **Skill Management Endpoints**

#### **6. Add User Skill**
```
POST /api/skills/add
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "skill_name": "JavaScript",
  "proficiency_level": "Intermediate"
}

Response (200):
{
  "message": "Skill added successfully",
  "skillId": 5
}
```

#### **7. Get User Skills**
```
GET /api/skills/user
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "skills": [
    {
      "id": 1,
      "skill_name": "JavaScript",
      "proficiency_level": "Intermediate",
      "created_at": "2026-02-04T10:30:00Z"
    }
  ]
}
```

#### **8. Update Skill Proficiency**
```
PUT /api/skills/:skillId
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "proficiency_level": "Advanced"
}

Response (200):
{
  "message": "Skill updated successfully"
}
```

#### **9. Delete Skill**
```
DELETE /api/skills/:skillId
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "message": "Skill deleted successfully"
}
```

### **Career Recommendation Endpoints**

#### **10. Get Career Recommendations**
```
GET /api/recommendations/career
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "recommendations": [
    {
      "id": 1,
      "career_title": "Full Stack Developer",
      "match_percentage": 85,
      "description": "Develop web applications...",
      "skills_required": ["JavaScript", "React", "Node.js"],
      "average_salary": "$100,000 - $150,000"
    }
  ]
}
```

#### **11. Get Interest Analysis**
```
GET /api/recommendations/interests
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "interests": [
    {
      "id": 1,
      "interest_category": "Technology",
      "score": 92,
      "careers": ["Software Developer", "Data Scientist"]
    }
  ]
}
```

### **Assessment Endpoints**

#### **12. Submit Skill Assessment**
```
POST /api/assessments/skill
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "assessment_type": "JavaScript Basics",
  "score": 85,
  "total_questions": 10,
  "correct_answers": 8,
  "time_taken": 1200
}

Response (200):
{
  "message": "Assessment recorded successfully",
  "assessmentId": 15
}
```

### **Learning Roadmap Endpoints**

#### **13. Generate Learning Roadmap**
```
POST /api/roadmap/generate
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "target_skill": "Full Stack Development",
  "current_level": "Beginner",
  "timeframe_weeks": 12
}

Response (200):
{
  "roadmapId": 1,
  "title": "Full Stack Developer Roadmap",
  "duration": "12 weeks",
  "phases": [
    {
      "phase": 1,
      "title": "Foundations",
      "topics": ["HTML", "CSS", "JavaScript Basics"],
      "duration": "2 weeks",
      "resources": [...]
    }
  ]
}
```

#### **14. Get User Learning Roadmap**
```
GET /api/roadmap/user
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "roadmaps": [
    {
      "id": 1,
      "title": "Full Stack Developer Roadmap",
      "progress": 45,
      "created_at": "2026-02-04T10:30:00Z"
    }
  ]
}
```

### **Health & Status Endpoints**

#### **15. Server Health Check**
```
GET /api/health

Response (200):
{
  "status": "Server is running",
  "timestamp": "2026-02-04T15:30:45Z"
}
```

---

## 💾 Database Setup

### **Option 1: SQLite (Default - Recommended)**

SQLite is the default database and requires no additional setup!

**Advantages:**
- ✅ No installation needed
- ✅ Works offline
- ✅ Portable (single file)
- ✅ Perfect for development and small-medium apps
- ✅ File: `career-backend/careernexus.db`

**Database Tables:**

```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  profile_image TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User skills table
CREATE TABLE user_skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  skill_name TEXT NOT NULL,
  proficiency_level TEXT DEFAULT 'Beginner',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- (Additional tables created automatically)
-- - assessments
-- - learning_paths
-- - recommendations
-- - interest_profiles
```

**Backup SQLite Database:**

```bash
# Copy the database file
cp career-backend/careernexus.db career-backend/careernexus.backup.db

# Or use git to track changes
git add career-backend/careernexus.db
git commit -m "Database backup"
```

---

### **Option 2: MongoDB Atlas (Cloud - Optional)**

If you prefer cloud database:

#### **Step 1: Create MongoDB Atlas Account**

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" (email or Google account)
3. Create a free cluster (M0 tier)

#### **Step 2: Get Connection String**

1. In Atlas dashboard, click "CONNECT"
2. Choose "Drivers"
3. Copy the connection string
4. Example: `mongodb+srv://user:password@cluster.mongodb.net/careernexus`

#### **Step 3: Update Backend .env**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/careernexus
DATABASE_TYPE=mongodb
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key-here
```

#### **Step 4: Whitelist Your IP**

1. In Atlas, go to "Network Access"
2. Click "ADD IP ADDRESS"
3. Add your current IP or select "ALLOW ACCESS FROM ANYWHERE"

#### **Step 5: Restart Backend**

```bash
cd career-backend
npm start
# MongoDB should now connect
```

**MongoDB Monitoring:**

```bash
# View your database data in Atlas
https://cloud.mongodb.com → Collections → View Data

# Or use MongoDB Compass (desktop app)
Download: https://www.mongodb.com/try/download/compass
```

---

## 🌐 Deployment

### **Deploy Backend to Render.com**

Render.com is a free hosting platform perfect for Node.js apps.

#### **Step 1: Prepare Repository**

```bash
# Ensure backend has correct package.json
cd career-backend
cat package.json
# Should have: "start": "node server.js"

# Ensure .env is in .gitignore
echo ".env" >> .gitignore
```

#### **Step 2: Push to GitHub**

```bash
git add .
git commit -m "Initial commit - CareerNexus Backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/CareerNexus-AI.git
git push -u origin main
```

#### **Step 3: Create Render Account**

1. Go to: https://render.com
2. Sign up with GitHub account
3. Authorize access to your repositories

#### **Step 4: Create New Web Service**

1. Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: careernexus-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `career-backend` (if in subfolder)

#### **Step 5: Add Environment Variables**

In Render dashboard:

```
PORT = 5000
NODE_ENV = production
JWT_SECRET = careernexus-production-secret-key-2026-super-secure
MONGODB_URI = (if using MongoDB)
```

#### **Step 6: Deploy**

1. Click "Create Web Service"
2. Render automatically deploys from your main branch
3. URL format: `https://careernexus-backend-xxxx.onrender.com`

#### **Step 7: Update Frontend API URL**

In [screens/Login.jsx](screens/Login.jsx#L31):

```javascript
const API_URL = 'https://careernexus-backend-p085.onrender.com/api/auth';
```

**Current Production URL**: https://career-backend-p085.onrender.com

---

### **Deploy Frontend to Expo**

#### **Using Expo Go (Easiest)**

```bash
npm start
# Scan QR code with Expo Go app
# Works on iOS and Android
```

#### **Using EAS Build (for App Stores)**

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account
eas login

# Configure your app
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## 🐛 Troubleshooting

### **Common Issues & Solutions**

#### **❌ Backend won't connect / "Connection refused"**

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# If fails, start backend:
cd career-backend
npm start

# Check if port 5000 is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000  # Mac/Linux

# Use different port
PORT=5001 npm start
```

#### **❌ "Cannot find module" error**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# For backend
cd career-backend
rm -rf node_modules package-lock.json
npm install
cd ..
```

#### **❌ MongoDB connection failed**

```bash
# Verify MongoDB is running
Get-Service MongoDB | Select-Object Status  # Windows

# Start MongoDB
Start-Service MongoDB  # Windows

# Or use MongoDB Atlas connection string
# Update MONGODB_URI in career-backend/.env
```

#### **❌ "CORS error" in browser**

The backend already has CORS enabled. If still getting errors:

1. Check API_URL in screens is correct
2. Ensure backend is running
3. Check browser console for specific error
4. Verify network tab in browser DevTools

#### **❌ Expo QR code not working**

```bash
# Restart Expo
npm start

# Clear Expo cache
expo start --clear

# Check network
# Make sure phone and computer are on same WiFi network

# Use LAN URL instead:
npm start
# Copy LAN URL and enter manually in Expo Go
```

#### **❌ Port already in use**

```bash
# For port 5000 (backend)
PORT=5001 npm start

# For port 8081 (Expo)
expo start --port 8082

# Or kill the process using port:
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### **❌ Database locked / SQLite error**

```bash
# SQLite gets locked if multiple processes access it
# Solution: Ensure only one backend instance is running

# Check running processes
ps aux | grep "node server"  # Mac/Linux
tasklist | findstr "node"    # Windows

# Kill duplicate processes
# Windows: taskkill /PID <process_id> /F
```

#### **❌ Profile image upload fails**

```bash
# Check uploads folder exists
mkdir -p career-backend/uploads

# Check folder permissions (Windows)
icacls career-backend\uploads /grant:r "%username%":F

# Clear uploads folder if corrupted
rm -rf career-backend/uploads/*
mkdir -p career-backend/uploads
```

### **Debugging Tools**

#### **Backend Debugging**

```bash
# Check server logs
cd career-backend
npm start

# Test specific endpoint
curl -X GET http://localhost:5000/api/health

# Use diagnostics tool
node diagnose.js

# Check database
# SQLite: directly inspect careernexus.db
```

#### **Frontend Debugging**

```bash
# Expo DevTools
# In metro bundler terminal, press:
# 'j' = open debugger
# 'd' = open DevTools
# 'r' = reload app

# React Native debugger
npm install -g react-native-debugger

# Browser DevTools (for web version)
npm start
# Press 'w'
# Open browser DevTools: F12
```

#### **Network Debugging**

```bash
# Use Thunder Client (VS Code extension)
# or Postman to test API endpoints

# Check network requests:
# Mobile: Use Expo DevTools → Network tab
# Web: Browser DevTools → Network tab
```

---

## 👥 Development Team

**CareerNexus** is developed and maintained by the **Neurospark Team** - a dedicated group of developers committed to building innovative career development solutions.

### **Neurospark Team**
- **Team Lead**: Arpitha
- **Focus Area**: AI-powered career guidance and skill development platforms
- **Based**: Global remote team
- **Since**: 2026

### **Project Contributors**
- Frontend Development (React Native/Expo)
- Backend Development (Node.js/Express)
- Database Design (SQLite/MongoDB)
- UI/UX Design
- Quality Assurance & Testing
- Documentation

### **Contact & Social**
- **GitHub**: https://github.com/arpitha-5/CareerNexus-AI
- **LinkedIn**: https://www.linkedin.com/in/arpitha-medarametla

### **About Neurospark**
Neurospark specializes in:
- 🧠 AI and Machine Learning applications
- 📱 Cross-platform mobile development
- 🎓 EdTech and career development solutions
- ☁️ Cloud-based architectures
- 🚀 Scalable web applications

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### **How to Contribute**

1. **Fork the Repository**
   ```bash
   # Click "Fork" on GitHub
   git clone https://github.com/YOUR_USERNAME/CareerNexus-AI.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Write clean, documented code
   - Follow existing code style
   - Test thoroughly

4. **Commit & Push**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Describe your changes
   - Wait for review

### **Development Guidelines**

- **Code Style**: Follow existing patterns in codebase
- **Naming**: Use camelCase for JavaScript, PascalCase for components
- **Comments**: Document complex logic
- **Testing**: Test your changes before submitting PR
- **Commits**: Use clear, descriptive commit messages

### **Reporting Issues**

1. Check if issue already exists
2. Provide detailed description
3. Include steps to reproduce
4. Add screenshots/logs if relevant
5. Mention your environment (OS, Node version, etc.)

---

## 📄 License

This project is licensed under the **ISC License**.

For more details, see the LICENSE file in the repository.

---

## 🎯 Roadmap & Future Features

### **Planned Features**
- 🤖 Advanced AI career matching (ML algorithms)
- 📊 Enhanced analytics dashboard
- 🏆 Gamification (badges, achievements)
- 🤝 Mentor/mentee matching system
- 💼 Job board integration
- 📱 Progressive Web App (PWA) version
- 🌍 Multi-language support
- 🎯 Real-time notifications
- 📈 Advanced reporting & certifications

---

## ❓ FAQ

**Q: Can I use this without MongoDB?**
A: Yes! SQLite is the default and works perfectly without any external database.

**Q: How do I update the API URL?**
A: Update the `API_URL` constant in each screen file where API calls are made.

**Q: Is the app secure?**
A: Yes, it uses JWT tokens, bcryptjs password hashing, and CORS protection. Always use HTTPS in production.

**Q: Can I deploy this to production?**
A: Yes! Use Render.com for backend and EAS Build for mobile apps.

**Q: How do I reset the database?**
A: Delete `career-backend/careernexus.db` and restart the backend. A new database will be created automatically.

**Q: Can I use this as a starting template?**
A: Yes! The project structure is modular and easy to extend.

---

## 📞 Support & Help

- **Issues**: Report on GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: See README files in each directory

---

## 🙏 Acknowledgments

- Expo and React Native communities
- Express.js framework
- All contributors and testers
- Neurospark team members

---

## 📝 Changelog

### **Version 1.0.0** (February 2026)
- ✅ Initial release
- ✅ Core authentication system
- ✅ Skill assessment module
- ✅ Career recommendations engine
- ✅ Learning roadmap generator
- ✅ Report generation & download
- ✅ Profile management
- ✅ SQLite database integration
- ✅ Render.com deployment ready

---

**Last Updated**: February 4, 2026  
**Maintained By**: Neurospark Team  
**Version**: 1.0.0

---

## 🌟 Star Us!

If you find CareerNexus helpful, please star the repository on GitHub to support our work!

⭐ https://github.com/arpitha-5/CareerNexus-AI

---

**Happy Coding! 🚀**


