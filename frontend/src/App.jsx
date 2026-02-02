import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CareerProvider } from './context/CareerContext.jsx';
import LandingPage from './pages/Landing/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CareerPage from './pages/Career/CareerPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import FeaturesPage from './pages/Features/FeaturesPage.jsx';
import AuthSuccessPage from './pages/Auth/AuthSuccessPage.jsx';
import StudentProfilePage from './pages/Profile/StudentProfilePage.jsx';
import CareerGuidancePage from './pages/Career/CareerGuidancePage.jsx';
import ResumeAnalysisPage from './pages/Career/ResumeAnalysisPage.jsx';
import CoursesPage from './pages/Career/CoursesPage.jsx';
import InternshipsPage from './pages/Career/InternshipsPage.jsx';
import InterviewPreparationPage from './pages/Career/InterviewPreparationPage.jsx';
import LearningRoadmapPage from './pages/Career/LearningRoadmapPage.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';
import JobRoleMatchPage from './pages/Career/JobRoleMatchPage.jsx';
import SkillGapPage from './pages/Career/SkillGapPage.jsx';
import CareerAdvisorPage from './pages/Career/CareerAdvisorPage.jsx';
import LearningPathPage from './pages/Career/LearningPathPage.jsx';
import CodeMentorPage from './pages/Career/CodeMentorPage.jsx';
import AIChatPage from './pages/Career/AIChatPage.jsx';

function App() {
  return (
    <AuthProvider>
      <CareerProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/student" element={<LoginPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<StudentProfilePage />} />
          <Route path="/careers" element={<CareerPage />} />
          <Route path="/career/guidance" element={<CareerGuidancePage />} />
          <Route path="/career/resume" element={<ResumeAnalysisPage />} />
          <Route path="/career/interview" element={<InterviewPreparationPage />} />
          <Route path="/career/roadmap" element={<LearningRoadmapPage />} />
          <Route path="/community-info" element={<CommunityPage />} />
          <Route path="/career/courses" element={<CoursesPage />} />
          <Route path="/career/internships" element={<InternshipsPage />} />

          {/* AI Learning Routes */}
          <Route path="/career/skill-gap" element={<SkillGapPage />} />
          <Route path="/career/match" element={<JobRoleMatchPage />} />
          <Route path="/career/learning-path" element={<LearningPathPage />} />
          <Route path="/ai/weekly-goals" element={<PlaceholderPage title="Weekly Goals" description="Track your weekly learning tasks and projects." />} />
          <Route path="/ai/skill-roadmap" element={<PlaceholderPage title="Skill Roadmap" description="Visual roadmap from beginner to advanced." />} />
          <Route path="/career/advisor" element={<CareerAdvisorPage />} />

          {/* AI Tools Routes */}
          <Route path="/ai/code-mentor" element={<CodeMentorPage />} />
          <Route path="/ai/project-generator" element={<PlaceholderPage title="Project Generator" description="Generate industry-standard project ideas." />} />
          <Route path="/ai/chatbot" element={<AIChatPage />} />

          {/* Analytics Routes */}
          <Route path="/ai/certificate-analyzer" element={<PlaceholderPage title="Certificate Analyzer" description="Extract skills from your certificates." />} />

          {/* Community Routes */}
          <Route path="/ai/custom-goals" element={<PlaceholderPage title="Custom Goals" description="Set and track your own career goals." />} />
          <Route path="/ai/peer-learning" element={<PlaceholderPage title="Peer Learning" description="Connect with peers for challenges and learning." />} />

          <Route path="/features" element={<FeaturesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CareerProvider>
    </AuthProvider>
  );
}

export default App;
