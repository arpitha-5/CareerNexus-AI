import React from 'react';
import Navbar from '../../components/common/Navbar.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { motion } from 'framer-motion';

// Helper for company-specific colors
const companyColor = (company) => {
  switch (company) {
    case 'Google':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'Amazon':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Flipkart':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Swiggy':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Microsoft':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Netflix':
      return 'bg-red-600/20 text-red-500 border-red-600/30';
    case 'Uber':
      return 'bg-slate-700 text-slate-200 border-slate-600';
    case 'PhonePe':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Meta':
      return 'bg-blue-400/20 text-blue-300 border-blue-400/30';
    case 'Airbnb':
      return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
    case 'Razorpay':
      return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    case 'Cred':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'AWS':
      return 'bg-yellow-600/20 text-yellow-500 border-yellow-600/30';
    case 'Azure':
      return 'bg-blue-600/20 text-blue-500 border-blue-600/30';
    case 'Google Cloud':
      return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
    case 'IBM':
      return 'bg-blue-700/20 text-blue-500 border-blue-700/30';
    default:
      return 'bg-slate-800 text-slate-200 border-slate-600';
  }
};

const CareerPage = () => {
  const { theme } = useTheme();

  const careerPaths = [
    {
      role: 'Full Stack Developer',
      salary: '₹8–25 LPA (Indicative)',
      demand: 'High Demand',
      companies: ['Google', 'Amazon', 'Flipkart', 'Swiggy'],
      skills: ['Frontend Development', 'Backend Development', 'Databases', 'Cloud Basics'],
    },
    {
      role: 'Backend Engineer',
      salary: '₹10–30 LPA (Indicative)',
      demand: 'Very High Demand',
      companies: ['Microsoft', 'Netflix', 'Uber', 'PhonePe'],
      skills: ['Server-side Programming', 'Databases', 'APIs', 'System Design'],
    },
    {
      role: 'Frontend Developer',
      salary: '₹7–22 LPA (Indicative)',
      demand: 'High Demand',
      companies: ['Meta', 'Airbnb', 'Razorpay', 'Cred'],
      skills: ['UI Development', 'JavaScript Frameworks', 'Performance Optimization'],
    },
    {
      role: 'DevOps Engineer',
      salary: '₹12–35 LPA (Indicative)',
      demand: 'Very High Demand',
      companies: ['Amazon', 'Microsoft', 'Atlassian', 'PayPal'],
      skills: ['Cloud Infrastructure', 'CI/CD', 'Containerization', 'Monitoring'],
    },
    {
      role: 'Data Engineer',
      salary: '₹10–28 LPA (Indicative)',
      demand: 'High Demand',
      companies: ['Google', 'Uber', 'Swiggy', 'Ola'],
      skills: ['Data Pipelines', 'SQL', 'Distributed Systems', 'ETL Tools'],
    },
    {
      role: 'Cloud Architect',
      salary: '₹15–40 LPA (Indicative)',
      demand: 'Very High Demand',
      companies: ['AWS', 'Azure', 'Google Cloud', 'IBM'],
      skills: ['Cloud Architecture', 'Security', 'Infrastructure Design'],
    },
  ];

  return (
    <div className="min-h-screen theme-bg" data-theme={theme}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-24 pb-20">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-indigo-400 mb-4">
            Explore Career Paths
          </h1>
          <p className="text-lg theme-text-muted max-w-3xl mx-auto">
            Understand technology career options, required skills, and market demand
            before receiving AI-driven career recommendations.
          </p>
        </motion.div>

        {/* Career Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {careerPaths.map((path, idx) => (
            <motion.div
              key={idx}
              className="theme-card p-6 border border-slate-700 hover:border-indigo-500 transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ scale: 1.04 }}
            >
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 font-semibold">
                {path.demand}
              </span>

              <h3 className="text-xl font-semibold mt-4 mb-2">
                {path.role}
              </h3>

              <p className="text-sm text-green-400 mb-4">
                {path.salary}
              </p>

              {/* Companies */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-indigo-400 mb-2">
                  Key Hiring Organizations
                </p>
                <div className="flex flex-wrap gap-2">
                  {path.companies.map((company, cidx) => (
                    <span
                      key={cidx}
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${companyColor(company)}`}
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-xs font-semibold text-purple-400 mb-2">
                  Core Skills Required
                </p>
                <ul className="list-disc list-inside text-xs theme-text-muted space-y-1">
                  {path.skills.map((skill, sidx) => (
                    <li key={sidx}>{skill}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="theme-card p-12 border border-indigo-500/30 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-semibold mb-4">
            Unsure Which Career Suits You?
          </h2>
          <p className="text-lg theme-text-muted max-w-2xl mx-auto mb-8">
            Use our AI-based career guidance system to receive personalized
            recommendations based on your skills, interests, and academic background.
          </p>

          <div className="flex justify-center gap-6">
            <a
              href="/dashboard"
              className="px-8 py-4 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition"
            >
              Get AI Career Guidance
            </a>
            <a
              href="/profile"
              className="px-8 py-4 border border-indigo-500 text-indigo-400 font-semibold rounded-lg hover:bg-indigo-500/10 transition"
            >
              Update Profile
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CareerPage;
