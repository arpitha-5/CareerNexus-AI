import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import RoleCTAButtons from '../common/RoleCTAButtons.jsx';

/**
 * Career Snapshot Data
 * (Replace with API later)
 */
const careerSnapshot = {
  xp: 4320,
  weeklyXp: 320,
  streakDays: 21,
  resumeScore: 87,
  resumeStatus: 'ATS-Optimized',
  roadmapStatus: 'AI-driven career roadmap & readiness visualization'
};

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="lb-hero">
      {/* Decorative Wave */}
      <svg
        className="lb-hero-wave"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,256L60,245.3C120,235,240,213,360,213.3C480,213,600,235,720,240C840,245,960,235,1080,218.7C1200,203,1320,181,1380,170.7L1440,160L1440,320L0,320Z"
        />
      </svg>

      <div className="lb-hero-inner">
        {/* LEFT CONTENT */}
        <motion.div
          className="lb-hero-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="lb-hero-kicker">AI-Powered Career Intelligence</p>

          <h1 className="lb-hero-title">
            CareerNexus <span>AI</span>
          </h1>

          <p className="lb-hero-tagline">
            Build your future with confidence using real-time market data, personalized learning paths, and AI interview coaching.
          </p>

          <p className="lb-hero-subcopy">
            Stop guessing. Start growing. CareerNexus analyzes your unique profile to generate a roadmap that actually works for you.
          </p>

          <div className="lb-hero-cta-row">
            <RoleCTAButtons
              onStudent={() => navigate('/login')}
              onAdmin={() => navigate('/login')}
            />
          </div>
        </motion.div>

        {/* RIGHT SNAPSHOT CARD */}
        <motion.div
          className="lb-hero-right"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <div className="lb-hero-right-glow" />

          <div className="lb-hero-right-card">
            <p className="lb-hero-right-title">LIVE CAREER SNAPSHOT</p>

            {/* METRICS */}
            <div className="lb-hero-metrics">
              <div>
                <p className="lb-hero-metric-label">Career XP</p>
                <p className="lb-hero-metric-value" style={{ color: '#4ade80' }}>
                  {careerSnapshot.xp.toLocaleString()}
                </p>
                <p className="lb-hero-metric-small">
                  +{careerSnapshot.weeklyXp} this week
                </p>
              </div>

              <div>
                <p className="lb-hero-metric-label">Career Streak</p>
                <p className="lb-hero-metric-value" style={{ color: '#fbbf24' }}>
                  {careerSnapshot.streakDays}
                </p>
                <p className="lb-hero-metric-small">days active</p>
              </div>

              <div>
                <p className="lb-hero-metric-label">Resume Strength</p>
                <p className="lb-hero-metric-value" style={{ color: '#7dd3fc' }}>
                  {careerSnapshot.resumeScore}
                </p>
                <p className="lb-hero-metric-small">
                  {careerSnapshot.resumeStatus}
                </p>
              </div>
            </div>

            {/* ROADMAP BOX */}
            <div className="lb-hero-gradient-box">
              {careerSnapshot.roadmapStatus}
            </div>

            {/* FOOTNOTE */}
            <p className="lb-hero-footnote">
              Powered by AI intelligence for resume analysis, career readiness scoring,
              personalized career roadmaps, and multilingual career mentoring.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
