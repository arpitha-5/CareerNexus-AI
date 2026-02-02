import React from 'react';
import { motion } from 'framer-motion';

const offerings = [
  'AI Personalized Learning',
  'Gamified XP, Badges, Streaks',
  'AI Mentor (LearnBuddy)',
  'AI Career Roadmap Generator',
  'Internship & Placement Hub',
  'Resume Analyzer',
  'Community Forums',
  'Certification & Quizzes',
  'Multilingual Voice Learning',
  'Offline PWA Mode',
  'AI Proctoring',
  'Facial Attendance',
];

const OfferingsSection = () => {
  return (
    <section id="features" className="lb-offerings">
      <div className="lb-offerings-inner">
        <p className="lb-offerings-kicker">WHAT WE OFFER</p>
        <h2 className="lb-offerings-title">
          A complete AI-first learning &amp; career ecosystem
        </h2>
        <div className="lb-offerings-grid">
          {offerings.map((title, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="lb-offering-card"
            >
              <div className="lb-offering-index">{idx + 1}</div>
              <p className="lb-offering-label">{title}</p>
              <p className="lb-offering-desc">
                Adaptive intelligence, analytics and automation designed to boost outcomes for learners, mentors and
                admins.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferingsSection;
