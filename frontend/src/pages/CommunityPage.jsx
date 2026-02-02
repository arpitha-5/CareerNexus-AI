import React from 'react';
import Navbar from '../components/common/Navbar.jsx';

function CommunityPage() {
  return (
    <div className="min-h-screen theme-bg">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-20">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold text-indigo-400 mb-4">
            CareerNexus AI Community
          </h1>
          <p className="text-lg theme-text-muted max-w-3xl mx-auto">
            A collaborative space designed to complement AI-based career guidance
            through peer learning, mentorship, and shared experiences.
          </p>
        </div>

        {/* Highlight Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="theme-card p-6 border border-slate-700 text-center">
            <h3 className="text-xl font-semibold mb-2">Peer Learning</h3>
            <p className="text-sm theme-text-muted">
              Learn from students following similar career paths and goals.
            </p>
          </div>
          <div className="theme-card p-6 border border-slate-700 text-center">
            <h3 className="text-xl font-semibold mb-2">Mentor Guidance</h3>
            <p className="text-sm theme-text-muted">
              Gain insights from seniors, alumni, and industry professionals.
            </p>
          </div>
          <div className="theme-card p-6 border border-slate-700 text-center">
            <h3 className="text-xl font-semibold mb-2">Career Discussions</h3>
            <p className="text-sm theme-text-muted">
              Discuss career paths, resumes, and interview preparation strategies.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Purpose of the Community
            </h2>
            <p className="theme-text-muted leading-relaxed mb-4">
              While AI provides data-driven career recommendations, students often
              seek validation, shared experiences, and real-world perspectives.
              The CareerNexus AI Community bridges this gap by enabling meaningful
              interactions among learners and mentors.
            </p>
            <p className="theme-text-muted leading-relaxed">
              This ensures career decisions are not only intelligent, but also
              practical and confidence-driven.
            </p>
          </div>

          <div className="space-y-6">
            <div className="theme-card p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-2">
                Discussion Forums
              </h3>
              <p className="text-sm theme-text-muted">
                Structured forums for career guidance, resume feedback, and interview experiences.
              </p>
            </div>

            <div className="theme-card p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-2">
                Focused Peer Groups
              </h3>
              <p className="text-sm theme-text-muted">
                Small learning groups based on roles such as Frontend Developer,
                Data Analyst, or Machine Learning Engineer.
              </p>
            </div>

            <div className="theme-card p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-2">
                Collaborative Preparation
              </h3>
              <p className="text-sm theme-text-muted">
                Students collaborate on interview preparation and career roadmaps
                aligned with AI recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Integration Section */}
        <div className="theme-card p-10 border border-indigo-500/30 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Integrated With AI Career Guidance
          </h2>
          <p className="theme-text-muted max-w-3xl mx-auto mb-8">
            Community insights complement AI-driven career recommendations,
            helping students validate decisions, gain confidence, and prepare
            more effectively for real-world opportunities.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-10 py-4 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
