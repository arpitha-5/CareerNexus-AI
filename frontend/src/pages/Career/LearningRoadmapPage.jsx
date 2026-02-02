import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar.jsx';
import { useCareer } from '../../context/CareerContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadCareerReport, generateCareerRoadmap } from '../../api/aiApi.js';
import { useLocation } from 'react-router-dom';

const LearningRoadmapPage = () => {
  const { selectedCareer } = useCareer();
  const location = useLocation();
  const [activePhase, setActivePhase] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Default static data
  const defaultData = {
    role: "Associate Software Engineer",
    overview: {
      duration: "6 Months",
      difficulty: "Intermediate",
      commitment: "15-20 hours/week",
      summary: "This premium roadmap is designed to take you from foundational knowledge to job-readiness. It focuses on core programming skills, advanced data structures, and practical development experience suitable for entry-level positions."
    },
    milestones: [
      { id: 1, label: "Master Core Syntax & logic", completed: true },
      { id: 2, label: "Solve 100+ LeetCode Problems", completed: false },
      { id: 3, label: "Build 2 End-to-End Projects", completed: false },
      { id: 4, label: "Complete Mock Interviews", completed: false },
    ],
    phases: [
      {
        id: 1,
        title: "Foundation & Core Skills",
        duration: "Month 1-2",
        outcome: "Ability to write clean, efficient code and understand core computer science concepts.",
        color: "from-teal-500 to-emerald-500",
        skills: ["Java/Python", "OOPs", "Basic Data Structures", "Git/GitHub"],
        tasks: [
          "Learn language syntax and core libraries",
          "Understand Object-Oriented Programming (OOP) principles",
          "Practice solving basic problems on HackerRank",
          "Version control basics with Git"
        ]
      },
      {
        id: 2,
        title: "Data Structures & Algorithms",
        duration: "Month 3-4",
        outcome: "Proficiency in solving complex algorithmic problems and optimizing code performance.",
        color: "from-indigo-500 to-purple-500",
        skills: ["Arrays & Strings", "Trees & Graphs", "Dynamic Programming", "Time Complexity"],
        tasks: [
          "Master Arrays, Strings, and Linked Lists",
          "Study Trees, Graphs, and Heaps",
          "Learn Sorting and Searching algorithms",
          "Practice 50+ Medium level problems on LeetCode"
        ]
      },
      {
        id: 3,
        title: "Development & Systems",
        duration: "Month 5",
        outcome: "Capability to build scalable applications and understand system architecture.",
        color: "from-blue-500 to-cyan-500",
        skills: ["Database Management (SQL)", "REST APIs", "System Design Basics", "Spring Boot/Django"],
        tasks: [
          "Design normalized database schemas",
          "Build and document RESTful APIs",
          "Create a full-stack CRUD application",
          "Deploy application to cloud (AWS/Heroku)"
        ]
      },
      {
        id: 4,
        title: "Interview Readiness",
        duration: "Month 6",
        outcome: "Confidence to clear technical rounds and behavioral interviews.",
        color: "from-pink-500 to-rose-500",
        skills: ["System Design", "Behavioral Answers", "Resume Writing", "Mock Interviews"],
        tasks: [
          "Prepare STAR method answers for behavioral questions",
          "Participate in peer mock interviews",
          "Optimize resume and LinkedIn profile",
          "Apply to target companies"
        ]
      }
    ]
  };

  const [roadmapData, setRoadmapData] = useState(defaultData);

  useEffect(() => {
    const fetchRoadmap = async () => {
      const targetRole = location.state?.role || selectedCareer;
      if (targetRole && targetRole !== roadmapData.role) {
        setLoading(true);
        try {
          const response = await generateCareerRoadmap(targetRole);
          if (response.data && response.data.roadmapJson) {
            const apiData = response.data.roadmapJson;

            // Map API response to UI structure
            setRoadmapData({
              role: apiData.targetRole,
              overview: {
                duration: apiData.timeline,
                difficulty: apiData.currentLevel === 'beginner' ? 'Beginner Friendly' : 'Advanced',
                commitment: "15-20 hours/week",
                summary: `A personalized ${apiData.timeline} roadmap to become a ${apiData.targetRole}, focusing on addressing your specific skill gaps: ${apiData.skillGaps?.slice(0, 3).join(', ')}.`
              },
              milestones: apiData.milestones?.map((m, idx) => ({
                id: idx + 1,
                label: m.title,
                completed: idx === 0
              })) || defaultData.milestones,
              phases: apiData.milestones?.map((m, idx) => ({
                id: idx + 1,
                title: m.title,
                duration: `Month ${m.month}`,
                outcome: `Mastery of ${m.skills?.[0] || 'core concepts'}`,
                color: idx % 2 === 0 ? "from-indigo-500 to-purple-500" : "from-blue-500 to-cyan-500",
                skills: m.skills || [],
                tasks: m.checkpoints || m.generatedTasks || ["Complete module assignments", "Build a practice project"]
              })) || defaultData.phases
            });
          }
        } catch (error) {
          console.error("Failed to fetch dynamic roadmap", error);
          // Fallback to default but update title if possible, or just stay on default
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRoadmap();
  }, [location.state, selectedCareer]);

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      const response = await downloadCareerReport();

      // Check content type to decide extension
      const contentType = response.headers['content-type'] || 'application/pdf';
      const extension = contentType.includes('text/plain') ? 'txt' : 'pdf';
      const filename = `Career-Report.${extension}`;

      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);

      // Append to html link element page
      document.body.appendChild(link);

      // Start download
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("PDF Download failed", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const data = roadmapData;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50 mb-6 backdrop-blur-md">
            <div className="px-6 py-2 rounded-full bg-slate-900/90 backdrop-blur-xl">
              <span className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
                PREMIUM CAREER TRACK
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-xl">
            Career <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Roadmap</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Your personalized, AI-powered journey to mastering
            <span className="text-indigo-300 font-semibold"> {data.role}</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {loading && (
            <div className="lg:col-span-12 flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              <span className="ml-3 text-slate-400 self-center">Generating personalized roadmap for {roadmapData.role}...</span>
            </div>
          )}

          {!loading && (
            <>
              {/* Main Content - Timeline (Left Side) */}
              <div className="lg:col-span-8 space-y-10">

                {/* Overview Section - Glassmorphism */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur-lg"></div>
                  <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <span className="text-2xl">🎯</span> Target Overview
                        </h3>
                        <p className="text-slate-300 leading-relaxed text-sm/6">
                          {data.overview.summary}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 min-w-[240px]">
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                          <div className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">Duration</div>
                          <div className="text-white font-bold text-lg">{data.overview.duration}</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                          <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Level</div>
                          <div className="text-white font-bold text-lg">{data.overview.difficulty}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Phases List with Vertical Timeline */}
                <div className="relative space-y-8 pl-8 md:pl-0">
                  {/* Vertical Connection Line */}
                  <div className="absolute left-[39px] md:left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-500/50 via-purple-500/20 to-transparent hidden md:block"></div>

                  {data.phases.map((phase, index) => (
                    <motion.div
                      key={phase.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                      className="relative md:pl-24 group"
                    >
                      {/* Phase Number/Icon */}
                      <div className={`absolute left-0 md:left-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${phase.color} p-[1px] shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)] z-10 transition-transform duration-300 group-hover:scale-110 hidden md:block`}>
                        <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                          <span className={`text-2xl font-black bg-gradient-to-br ${phase.color} bg-clip-text text-transparent`}>
                            {phase.id}
                          </span>
                        </div>
                      </div>

                      {/* Card content */}
                      <div className="relative bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-1 overflow-hidden transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-indigo-500/10">
                        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${phase.color}`}></div>

                        <div className="p-6 md:p-8">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <span className={`text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${phase.color} bg-clip-text text-transparent mb-2 block`}>
                                Phase {index + 1} • {phase.duration}
                              </span>
                              <h4 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                                {phase.title}
                              </h4>
                            </div>
                          </div>

                          {/* Outcome Box */}
                          <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 italic text-slate-300 text-sm">
                            <span className="font-semibold text-white not-italic block mb-1">Expected Outcome:</span>
                            "{phase.outcome}"
                          </div>

                          <div className="grid md:grid-cols-2 gap-8">
                            {/* Skills Tags */}
                            <div>
                              <h5 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Master Skills</h5>
                              <div className="flex flex-wrap gap-2">
                                {phase.skills.map(skill => (
                                  <span key={skill} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 transition hover:bg-slate-700 hover:text-white cursor-default">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Tasks List */}
                            <div>
                              <h5 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Action Plan</h5>
                              <ul className="space-y-3">
                                {phase.tasks.map((task, idx) => (
                                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 group/item">
                                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${phase.color} group-hover/item:scale-150 transition-transform`}></div>
                                    <span className="group-hover/item:text-white transition-colors">{task}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sidebar - Milestones & Actions (Right Side) */}
              <div className="lg:col-span-4 space-y-8">

                {/* Progress Checklist - Sticky */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="sticky top-28"
                >
                  <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1 overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none"></div>

                    <div className="relative p-6">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="text-indigo-400">⚡</span> Milestones
                      </h3>

                      <div className="space-y-4 mb-8">
                        {data.milestones.map((milestone) => (
                          <label key={milestone.id} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/5">
                            <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                              <input type="checkbox" defaultChecked={milestone.completed} className="peer appearance-none w-5 h-5 rounded border border-slate-600 checked:bg-indigo-500 checked:border-indigo-500 transition-colors cursor-pointer" />
                              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors peer-checked:line-through peer-checked:text-slate-600">
                              {milestone.label}
                            </span>
                          </label>
                        ))}
                      </div>

                      <div className="h-px bg-slate-800 my-6"></div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={handleDownloadPdf}
                          disabled={downloading}
                          className="relative w-full py-3.5 group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed">
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                          <span className="relative flex items-center justify-center gap-2">
                            {downloading ? 'Downloading...' : 'Download PDF'} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          </span>
                        </button>
                        <button className="w-full py-3.5 rounded-xl border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-colors flex items-center justify-center gap-2">
                          Sync Calendar <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

              </div>

            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default LearningRoadmapPage;
