import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCareer } from '../../context/CareerContext.jsx';
import '../../styles/CareerRoadmapEnhanced.css';

/**
 * CAREER ROADMAP COMPONENT - DYNAMIC & INTERACTIVE
 * 
 * Features:
 * - Dynamic roadmap based on selected career from guidance page
 * - Real-time search/filtering by keywords
 * - Animated phase entrance effects
 * - Multi-path execution (internship, placement, studies)
 * - Task tracking and completion
 * - Impact preview with estimated outcomes
 * - More interactive features (difficulty, time, skills, salary projection)
 */

const CareerRoadmap = () => {
  const { selectedCareer, selectedPath, setSelectedPath, confidence, careerAnalysis } = useCareer();
  
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedPhase, setExpandedPhase] = useState('foundation');
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredPhases, setFilteredPhases] = useState(null);
  const [animatingPhases, setAnimatingPhases] = useState(new Set());
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch roadmap on component mount or when career/path changes
  useEffect(() => {
    if (selectedCareer) {
      fetchDynamicRoadmap(selectedCareer, selectedPath);
    } else {
      // Show sample roadmap if no career selected
      setRoadmapData(generateSampleRoadmap('placement'));
      setLoading(false);
    }
  }, [selectedCareer, selectedPath]);

  // Search and filter functionality
  useEffect(() => {
    if (!roadmapData) return;

    if (!searchKeyword.trim() && difficultyFilter === 'all') {
      setFilteredPhases(null);
      return;
    }

    const filtered = roadmapData.phases
      .map(phase => ({
        ...phase,
        tasks: phase.tasks.filter(task => {
          const matchesKeyword =
            !searchKeyword.trim() ||
            task.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            task.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            task.reason.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            (task.skills && task.skills.some(s => s.toLowerCase().includes(searchKeyword.toLowerCase())));

          const matchesDifficulty =
            difficultyFilter === 'all' || 
            (task.difficulty && task.difficulty.toLowerCase() === difficultyFilter.toLowerCase());

          return matchesKeyword && matchesDifficulty;
        }),
      }))
      .filter(phase => phase.tasks.length > 0);

    setFilteredPhases(filtered);
  }, [searchKeyword, difficultyFilter, roadmapData]);

  /**
   * Fetch dynamic roadmap from Flask backend based on selected career
   */
  const fetchDynamicRoadmap = async (career, path) => {
    try {
      setLoading(true);

      // Try to fetch from Flask backend first (with AI analysis)
      try {
        const response = await fetch(
          `http://localhost:5000/api/roadmap?career=${encodeURIComponent(
            career
          )}&path=${path}&level=${experienceLevel || 'Fresher'}`
        );

        if (response.ok) {
          const apiData = await response.json();
          if (apiData.success || apiData.data) {
            const roadmapData = apiData.data || apiData;
            setRoadmapData(roadmapData);
            setExpandedPhase('foundation');
            setCompletedTasks(new Set());
            // Animate phases on load
            if (roadmapData.phases) {
              animatePhasesEntrance(roadmapData.phases);
            }
            setLoading(false);
            return;
          }
        }
      } catch (flaskError) {
        console.log('Flask backend unavailable, using local generation:', flaskError.message);
      }

      // Fallback to dynamic generation
      const generatedRoadmap = generateDynamicRoadmap(career, path, careerAnalysis);
      setRoadmapData(generatedRoadmap);
      setExpandedPhase('foundation');
      setCompletedTasks(new Set());
      animatePhasesEntrance(generatedRoadmap.phases);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      // Show sample roadmap on error
      const sampleRoadmap = generateSampleRoadmap(path);
      setRoadmapData(sampleRoadmap);
      setLoading(false);
    }
  };

  /**
   * Animate phases entrance with stagger effect
   */
  const animatePhasesEntrance = (phases) => {
    const phaseIds = new Set();
    phases.forEach((phase, index) => {
      setTimeout(() => {
        phaseIds.add(phase.id);
        setAnimatingPhases(new Set(phaseIds));
      }, index * 200);
    });
  };

  /**
   * Generate dynamic roadmap based on career selection
   */
  const generateDynamicRoadmap = (career, path, analysis) => {
    const careerRoadmaps = {
      'Data Analyst': {
        icon: '📊',
        description: 'Transform raw data into actionable business insights',
        timeline: '12-16 weeks',
        salaryRange: '$60K - $95K',
        demandLevel: 'Very High',
        skillsRequired: ['Python', 'SQL', 'Excel', 'Power BI', 'Statistics'],
        phases: [
          {
            id: 'foundation',
            name: '📚 Foundation Phase',
            number: 1,
            duration: '4-6 weeks',
            description: 'Master core technical skills and tools',
            icon: '📚',
            color: '#14B8A6',
            difficulty: 'Intermediate',
            tasks: [
              {
                id: 'python-basics',
                title: 'Python for Data Analysis',
                description: 'Master Python fundamentals, NumPy, Pandas libraries for data manipulation',
                priority: 'High',
                difficulty: 'Intermediate',
                reason: 'Python is the most demanded tool for data analysts. 85% of job postings require Python.',
                impact: 'Resume score +15%. Direct skill match.',
                metric: 'technical',
                estimatedDays: 21,
                estimatedHours: 60,
                salaryImpact: '+$5K/year',
                resources: ['Python for Data Analysis - O\'Reilly', 'DataCamp Python course', 'Real datasets on Kaggle'],
                xpReward: 350,
                status: 'pending',
                locked: false,
                skills: ['Python', 'NumPy', 'Pandas'],
              },
              {
                id: 'sql-mastery',
                title: 'SQL for Data Querying & Analysis',
                description: 'Write complex queries, optimize performance, understand database design',
                priority: 'High',
                difficulty: 'Intermediate',
                reason: 'SQL is the gatekeeper to data. 95%+ of analyst roles require SQL proficiency.',
                impact: 'Resume score +18%. Interview readiness +40%.',
                metric: 'technical',
                estimatedDays: 21,
                estimatedHours: 50,
                salaryImpact: '+$8K/year',
                resources: ['SQL HackerRank', 'LeetCode Database', 'Mode Analytics SQL Tutorial'],
                xpReward: 400,
                status: 'pending',
                locked: false,
                skills: ['SQL', 'Database Design', 'Query Optimization'],
              },
              {
                id: 'power-bi',
                title: 'Power BI & Dashboard Creation',
                description: 'Create interactive dashboards, visualizations that tell stories with data',
                priority: 'High',
                difficulty: 'Beginner',
                reason: 'Visualization is how analysts communicate insights. Power BI skills in 70% of job postings.',
                impact: 'Resume score +12%. Portfolio boost.',
                metric: 'technical',
                estimatedDays: 14,
                estimatedHours: 35,
                salaryImpact: '+$4K/year',
                resources: ['Microsoft Learn Power BI', 'Power BI YouTube tutorials', 'Sample datasets'],
                xpReward: 300,
                status: 'pending',
                locked: false,
                skills: ['Power BI', 'Tableau', 'Data Visualization'],
              },
            ],
            completedTasks: 0,
            locked: false,
            progressPercent: 0,
          },
          {
            id: 'portfolio',
            name: '🎯 Portfolio Phase',
            number: 2,
            duration: '3-4 weeks',
            description: 'Build real-world projects to showcase skills',
            icon: '🎯',
            color: '#06B6D4',
            difficulty: 'Intermediate',
            tasks: [
              {
                id: 'project-ecommerce',
                title: 'E-Commerce Analysis Project',
                description: 'Analyze sales data, customer behavior, identify growth opportunities',
                priority: 'High',
                difficulty: 'Intermediate',
                reason: 'Portfolio projects are the strongest signal. Hiring managers want to see proven work.',
                impact: 'Resume score +25%. Sets you apart from 80% of candidates.',
                metric: 'portfolio',
                estimatedDays: 14,
                estimatedHours: 40,
                salaryImpact: '+$10K/year',
                resources: ['Kaggle ecommerce datasets', 'Case study templates', 'GitHub for hosting'],
                xpReward: 500,
                status: 'pending',
                locked: false,
                skills: ['SQL', 'Python', 'Data Visualization'],
              },
              {
                id: 'project-financial',
                title: 'Financial Analysis Dashboard',
                description: 'Build comprehensive financial dashboard with trends, forecasts, and KPIs',
                priority: 'High',
                difficulty: 'Intermediate',
                reason: 'Finance sector is high-paying. Financial analysis skills command premium salaries.',
                impact: 'Resume score +20%. Opens finance sector opportunities.',
                metric: 'portfolio',
                estimatedDays: 12,
                estimatedHours: 35,
                salaryImpact: '+$15K/year',
                resources: ['Financial datasets', 'Power BI advanced features', 'Case study examples'],
                xpReward: 450,
                status: 'pending',
                locked: true,
                skills: ['SQL', 'Excel', 'Power BI', 'Financial Analysis'],
              },
            ],
            completedTasks: 0,
            locked: false,
            progressPercent: 0,
          },
          {
            id: 'industry',
            name: '🚀 Industry Readiness',
            number: 3,
            duration: '4-6 weeks',
            description: 'Prepare for interviews and real-world scenarios',
            icon: '🚀',
            color: '#EC4899',
            difficulty: 'Intermediate',
            tasks: [
              {
                id: 'interview-technical',
                title: 'Technical Interview Preparation',
                description: 'Master SQL queries, coding problems, statistics questions, case studies',
                priority: 'High',
                difficulty: 'Intermediate',
                reason: 'Technical interviews filter 80% of candidates. Preparation is non-negotiable.',
                impact: 'Interview success rate increases 65%+. Offer negotiations improve.',
                metric: 'interview',
                estimatedDays: 21,
                estimatedHours: 60,
                salaryImpact: '+$8K/year',
                resources: ['LeetCode Database problems', 'Mode Analytics', 'System Design interviews'],
                xpReward: 400,
                status: 'pending',
                locked: false,
                skills: ['SQL', 'Problem Solving', 'Statistics'],
              },
              {
                id: 'behavioral-prep',
                title: 'Behavioral & Communication Mastery',
                description: 'Master STAR method, storytelling, communication of technical concepts',
                priority: 'High',
                difficulty: 'Beginner',
                reason: 'Behavioral skills determine if you pass phone screens. Technical skills get interviews.',
                impact: 'Phone screen pass rate increases 80%+.',
                metric: 'interview',
                estimatedDays: 7,
                estimatedHours: 20,
                salaryImpact: '+$3K/year',
                resources: ['STAR method guides', 'Mock interview platforms', 'Communication courses'],
                xpReward: 250,
                status: 'pending',
                locked: false,
                skills: ['Communication', 'Problem Solving', 'STAR Method'],
              },
            ],
            completedTasks: 0,
            locked: false,
            progressPercent: 0,
          },
          {
            id: 'execution',
            name: '💼 Execution Phase',
            number: 4,
            duration: '8-12 weeks',
            description: `Execute ${path === 'internship' ? 'internship' : path === 'placement' ? 'placements' : 'higher studies'} strategy`,
            icon: '💼',
            color: '#10B981',
            difficulty: 'Advanced',
            tasks: [
              {
                id: 'job-applications',
                title: 'Strategic Job Search & Applications',
                description: `Apply to 30-50 companies, optimize resume/profile for ATS, track applications`,
                priority: 'High',
                difficulty: 'Advanced',
                reason: 'Volume + Quality = Success. Apply smartly to high-match companies.',
                impact: 'Increases offer probability by 300%+.',
                metric: 'execution',
                estimatedDays: 30,
                estimatedHours: 80,
                salaryImpact: '+$12K/year baseline',
                resources: ['LinkedIn optimization', 'ATS scanner tools', 'Salary negotiation guides'],
                xpReward: 600,
                status: 'pending',
                locked: true,
                skills: ['Networking', 'Resume Optimization', 'Application Strategy'],
              },
              {
                id: 'offer-negotiation',
                title: 'Offer Evaluation & Negotiation',
                description: 'Evaluate offers, negotiate salary, benefits, title, growth opportunities',
                priority: 'Critical',
                difficulty: 'Advanced',
                reason: 'Smart negotiation can add $100K+ over 5 years. First offer is not final.',
                impact: 'Potential $15K-$30K+ salary increase + better benefits.',
                metric: 'execution',
                estimatedDays: 5,
                estimatedHours: 10,
                salaryImpact: '+$15K-$30K/year',
                resources: ['Salary negotiation guides', 'Market rate research', 'Offer evaluation templates'],
                xpReward: 400,
                status: 'pending',
                locked: true,
                skills: ['Negotiation', 'Market Research', 'Decision Making'],
              },
            ],
            completedTasks: 0,
            locked: false,
            progressPercent: 0,
          },
        ],
      },

      'Software Engineer': {
        icon: '💻',
        description: 'Build scalable applications and solve complex technical problems',
        timeline: '16-20 weeks',
        salaryRange: '$80K - $150K+',
        demandLevel: 'Very High',
        skillsRequired: ['Python/Java', 'System Design', 'Data Structures', 'Git', 'AWS/GCP'],
        phases: [
          {
            id: 'foundation',
            name: '📚 Foundation Phase',
            number: 1,
            duration: '6-8 weeks',
            description: 'Master programming fundamentals and core data structures',
            icon: '📚',
            color: '#14B8A6',
            difficulty: 'Intermediate',
            tasks: [
              {
                id: 'dsa-fundamentals',
                title: 'Data Structures & Algorithms Mastery',
                description: 'Arrays, LinkedLists, Stacks, Queues, Trees, Graphs, Dynamic Programming',
                priority: 'Critical',
                difficulty: 'Intermediate',
                reason: 'DSA is 70% of technical interviews. Weak DSA means automatic rejection.',
                impact: 'Interview pass rate increases 75%+.',
                metric: 'technical',
                estimatedDays: 35,
                estimatedHours: 100,
                salaryImpact: '+$20K/year',
                resources: ['LeetCode', 'AlgoExpert', 'Striver DSA series'],
                xpReward: 600,
                status: 'pending',
                locked: false,
                skills: ['DSA', 'Problem Solving', 'Algorithms'],
              },
            ],
            completedTasks: 0,
            locked: false,
            progressPercent: 0,
          },
        ],
      },

      'Product Manager': {
        icon: '🎯',
        description: 'Lead product strategy and drive user value',
        timeline: '10-14 weeks',
        salaryRange: '$100K - $200K+',
        demandLevel: 'High',
        skillsRequired: ['Product Strategy', 'Analytics', 'Communication', 'Leadership', 'Market Research'],
        phases: [
          {
            id: 'foundation',
            name: '📚 Foundation Phase',
            number: 1,
            duration: '3-4 weeks',
            description: 'Understand product fundamentals and frameworks',
            icon: '📚',
            color: '#14B8A6',
            difficulty: 'Beginner',
            tasks: [
              {
                id: 'pm-frameworks',
                title: 'Product Management Frameworks & Methodologies',
                description: 'Learn RICE prioritization, OKRs, user research, competitive analysis',
                priority: 'High',
                difficulty: 'Beginner',
                reason: 'PM frameworks guide all decision-making. Essential for interviews.',
                impact: 'Interview readiness +40%. Project capability +100%.',
                metric: 'technical',
                estimatedDays: 14,
                estimatedHours: 40,
                salaryImpact: '+$8K/year',
                resources: ['Reforge PM courses', 'Lean Product Playbook', 'Case study interviews'],
                xpReward: 300,
                status: 'pending',
                locked: false,
                skills: ['Product Strategy', 'Market Research', 'Analytics'],
              },
            ],
            completedTasks: 0,
            locked: false,
            progressPercent: 0,
          },
        ],
      },
    };

    const careerData = careerRoadmaps[career] || careerRoadmaps['Data Analyst'];

    return {
      career,
      careerIcon: careerData.icon,
      careerDescription: careerData.description,
      timeline: careerData.timeline,
      salaryRange: careerData.salaryRange,
      demandLevel: careerData.demandLevel,
      skillsRequired: careerData.skillsRequired,
      confidence: confidence || 82,
      path,
      experienceLevel: 'Fresher',
      phases: careerData.phases,
    };
  };

  /**
   * Generate sample roadmap for default display
   */
  const generateSampleRoadmap = (path) => {
    return generateDynamicRoadmap('Data Analyst', path, null);
  };

  /**
   * Toggle phase expansion with animation
   */
  const togglePhaseExpanded = (phaseId) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  /**
   * Handle task completion
   */
  const handleTaskComplete = (taskId) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  /**
   * Handle download roadmap
   */
  const handleDownloadRoadmap = () => {
    if (!roadmapData) return;

    const content = `CAREER ROADMAP: ${roadmapData.career.toUpperCase()}
Generated on: ${new Date().toLocaleString()}
Experience Level: ${roadmapData.experienceLevel}
Execution Path: ${roadmapData.path.toUpperCase()}

=============================================================================

CAREER OVERVIEW
- Career: ${roadmapData.career}
- Timeline: ${roadmapData.timeline}
- Salary Range: ${roadmapData.salaryRange}
- Market Demand: ${roadmapData.demandLevel}
- Confidence Level: ${roadmapData.confidence}%

REQUIRED SKILLS
${roadmapData.skillsRequired.map(skill => `  • ${skill}`).join('\n')}

=============================================================================

${roadmapData.phases
  .map(phase => {
    const completedCount = phase.tasks.filter(t => completedTasks.has(t.id)).length;
    return `
PHASE ${phase.number}: ${phase.name}
Duration: ${phase.duration}
Description: ${phase.description}
Progress: ${completedCount}/${phase.tasks.length} tasks completed

${phase.tasks
  .map(task => {
    const status = completedTasks.has(task.id) ? '✓' : '○';
    return `
  ${status} ${task.title}
     Difficulty: ${task.difficulty}
     Timeline: ${task.estimatedDays} days (${task.estimatedHours} hours)
     Priority: ${task.priority}
     XP Reward: ${task.xpReward}
     
     Description: ${task.description}
     
     Why: ${task.reason}
     Impact: ${task.impact}
     Salary Impact: ${task.salaryImpact}
     
     Resources:
${task.resources.map(r => `       - ${r}`).join('\n')}
`;
  })
  .join('\n')}
`;
  })
  .join('\n')}

=============================================================================
Generated by NEXUS AI Career Guidance System
`;

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
    );
    element.setAttribute('download', `${roadmapData.career}_Roadmap_${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  /**
   * Calculate overall progress
   */
  const calculateOverallProgress = () => {
    if (!roadmapData || roadmapData.phases.length === 0) return 0;
    const totalTasks = roadmapData.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
    return totalTasks > 0 ? Math.round((completedTasks.size / totalTasks) * 100) : 0;
  };

  const phasesToDisplay = filteredPhases || roadmapData?.phases;
  const overallProgress = calculateOverallProgress();

  if (loading) {
    return (
      <div className="roadmap-container">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 mx-auto my-20 border-4 border-gray-200 border-t-teal-600 rounded-full"
        />
        <p className="text-center text-gray-600">Generating your personalized roadmap...</p>
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <div className="roadmap-container">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Career Selected</h2>
          <p className="text-gray-600 mb-6">
            Complete a career analysis in the guidance page first to generate your personalized roadmap.
          </p>
          <motion.a
            href="/career/guidance"
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            Go to Career Guidance →
          </motion.a>
        </div>
      </div>
    );
  }

  return (
    <div className="roadmap-container">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="roadmap-header"
      >
        <div className="header-top">
          <div className="header-info">
            <h1>
              <span className="text-4xl">{roadmapData.careerIcon}</span>
              {roadmapData.career} Roadmap
            </h1>
            {selectedCareer && (
              <p className="text-sm text-gray-600">
                Personalized based on your career analysis
              </p>
            )}
          </div>

          <div className="header-stats">
            <motion.div whileHover={{ scale: 1.05 }} className="stat-card">
              <div className="stat-label">Confidence</div>
              <motion.div
                animate={{ width: `${roadmapData.confidence}%` }}
                className="stat-bar"
              />
              <div className="stat-value">{roadmapData.confidence}%</div>
            </motion.div>
            <div className="stat-card">
              <div className="stat-label">Progress</div>
              <motion.div
                animate={{ width: `${overallProgress}%` }}
                className="stat-bar bg-gradient-to-r from-emerald-400 to-emerald-600"
              />
              <div className="stat-value">{overallProgress}%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Timeline</div>
              <div className="stat-value text-lg">{roadmapData.timeline}</div>
            </div>
          </div>
        </div>

        {/* CAREER OVERVIEW */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="career-overview"
        >
          <div className="overview-item">
            <strong>💼 Salary Range:</strong> {roadmapData.salaryRange}
          </div>
          <div className="overview-item">
            <strong>📈 Market Demand:</strong>
            <span className="demand-badge high">{roadmapData.demandLevel}</span>
          </div>
          <div className="overview-item">
            <strong>📚 Key Skills:</strong> {roadmapData.skillsRequired.join(', ')}
          </div>
        </motion.div>
      </motion.div>

      {/* SEARCH & FILTERS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="search-filter-section"
      >
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Search roadmap by keyword, skill, or topic..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="search-input"
          />
          {searchKeyword && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => {
                setSearchKeyword('');
                setDifficultyFilter('all');
              }}
              className="clear-search-btn"
            >
              ✕ Clear
            </motion.button>
          )}
        </div>

        <div className="filter-buttons">
          {['all', 'Beginner', 'Intermediate', 'Advanced'].map(difficulty => (
            <motion.button
              key={difficulty}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDifficultyFilter(difficulty)}
              className={`filter-btn ${
                difficultyFilter.toLowerCase() === difficulty.toLowerCase() ? 'active' : ''
              }`}
            >
              {difficulty === 'all' ? 'All Levels' : difficulty}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* SEARCH RESULTS INFO */}
      {(searchKeyword || difficultyFilter !== 'all') && filteredPhases && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="search-results-info"
        >
          <span className="result-count">
            Found {filteredPhases.reduce((sum, p) => sum + p.tasks.length, 0)} matching tasks
          </span>
          {searchKeyword && (
            <span className="search-term">for "{searchKeyword}"</span>
          )}
        </motion.div>
      )}

      {/* PATH SELECTOR */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="path-selector"
      >
        <p className="path-label">Choose Execution Path:</p>
        <div className="path-buttons">
          {[
            {
              id: 'internship',
              label: '🎓 Internship',
              desc: 'Build experience',
            },
            {
              id: 'placement',
              label: '💼 Placement',
              desc: 'Direct job',
            },
            {
              id: 'higher-studies',
              label: '🎯 Higher Studies',
              desc: 'Advanced degree',
            },
          ].map(option => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPath(option.id)}
              className={`path-btn ${selectedPath === option.id ? 'active' : ''}`}
            >
              <div className="path-label-inner">{option.label}</div>
              <div className="path-desc">{option.desc}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* PHASES */}
      <div className="phases-container">
        <AnimatePresence>
          {phasesToDisplay?.map((phase, phaseIndex) => {
            const isAnimating = animatingPhases.has(phase.id);
            const completedInPhase = phase.tasks.filter(t => completedTasks.has(t.id)).length;
            const progressPercent = phase.tasks.length > 0 ? Math.round((completedInPhase / phase.tasks.length) * 100) : 0;

            return (
              <motion.div
                key={phase.id}
                initial={isAnimating ? { opacity: 0, x: -50 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: isAnimating ? phaseIndex * 0.15 : 0,
                  duration: 0.4,
                  type: 'spring',
                  stiffness: 80,
                }}
                className="phase-card"
              >
                {/* PHASE HEADER */}
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(20, 184, 166, 0.05)' }}
                  onClick={() => togglePhaseExpanded(phase.id)}
                  className="phase-header"
                >
                  <div className="phase-info">
                    <div className="phase-title-section">
                      <span className="phase-number">Phase {phase.number}</span>
                      <h3 className="phase-title">{phase.name}</h3>
                    </div>
                    <p className="phase-description">{phase.description}</p>
                    <div className="phase-meta">
                      <span className="meta-item">⏱️ {phase.duration}</span>
                      <span className="meta-item">
                        📊 {completedInPhase}/{phase.tasks.length} tasks
                      </span>
                      <span className={`difficulty-badge ${phase.difficulty.toLowerCase()}`}>
                        {phase.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="phase-progress-section">
                    <motion.div
                      animate={{ rotate: expandedPhase === phase.id ? 180 : 0 }}
                      className="expand-icon"
                    >
                      ▼
                    </motion.div>
                    <div className="phase-progress">
                      <motion.div
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5 }}
                        className="progress-fill"
                        style={{ backgroundColor: phase.color }}
                      />
                    </div>
                    <span className="progress-percent">{progressPercent}%</span>
                  </div>
                </motion.button>

                {/* PHASE TASKS */}
                <AnimatePresence>
                  {expandedPhase === phase.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="phase-tasks"
                    >
                      {phase.tasks.map((task, taskIndex) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: taskIndex * 0.05 }}
                          className={`task-card ${completedTasks.has(task.id) ? 'completed' : ''} ${
                            task.locked ? 'locked' : ''
                          }`}
                        >
                          {/* TASK HEADER */}
                          <div className="task-header">
                            <div className="task-checkbox-section">
                              <input
                                type="checkbox"
                                id={task.id}
                                checked={completedTasks.has(task.id)}
                                onChange={() => handleTaskComplete(task.id)}
                                disabled={task.locked}
                                className="task-checkbox"
                              />
                              <div className="task-title-section">
                                <h4>{task.title}</h4>
                                <div className="task-badges">
                                  <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                                    {task.priority}
                                  </span>
                                  <span className={`difficulty-badge ${task.difficulty.toLowerCase()}`}>
                                    {task.difficulty}
                                  </span>
                                  {task.locked && <span className="locked-badge">🔒 Locked</span>}
                                </div>
                              </div>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                              className="expand-task-btn"
                            >
                              {selectedTask === task.id ? '▲' : '▼'}
                            </motion.button>
                          </div>

                          <p className="task-description">{task.description}</p>

                          {/* EXPANDED TASK DETAILS */}
                          <AnimatePresence>
                            {selectedTask === task.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="task-details-expanded"
                              >
                                {/* EXPLAINABILITY */}
                                <div className="explainability-box">
                                  <div className="explainability-item">
                                    <strong>❓ Why This Task?</strong>
                                    <p>{task.reason}</p>
                                  </div>
                                  <div className="explainability-item">
                                    <strong>💡 Impact:</strong>
                                    <p>{task.impact}</p>
                                  </div>
                                </div>

                                {/* TASK METRICS */}
                                <div className="task-metrics">
                                  <div className="metric">
                                    <span className="metric-label">📅 Timeline</span>
                                    <span className="metric-value">
                                      {task.estimatedDays} days ({task.estimatedHours}h)
                                    </span>
                                  </div>
                                  <div className="metric">
                                    <span className="metric-label">⭐ XP Reward</span>
                                    <span className="metric-value">{task.xpReward} points</span>
                                  </div>
                                  <div className="metric">
                                    <span className="metric-label">💰 Salary Impact</span>
                                    <span className="metric-value salary-impact">{task.salaryImpact}</span>
                                  </div>
                                  <div className="metric">
                                    <span className="metric-label">🎯 Category</span>
                                    <span className="metric-value">{task.metric}</span>
                                  </div>
                                </div>

                                {/* SKILLS */}
                                {task.skills && task.skills.length > 0 && (
                                  <div className="skills-section">
                                    <strong>Skills You'll Learn:</strong>
                                    <div className="skills-list">
                                      {task.skills.map(skill => (
                                        <span key={skill} className="skill-tag">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* RESOURCES */}
                                {task.resources && task.resources.length > 0 && (
                                  <div className="resources">
                                    <strong>📚 Recommended Resources:</strong>
                                    <ul>
                                      {task.resources.map((resource, idx) => (
                                        <li key={idx}>
                                          <span className="resource-icon">→</span>
                                          {resource}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* NO RESULTS MESSAGE */}
      {filteredPhases && filteredPhases.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="no-results"
        >
          <p>❌ No tasks match your search criteria</p>
          <p className="text-sm text-gray-600">Try different keywords or reset your filters</p>
        </motion.div>
      )}

      {/* ACTION BUTTONS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="action-buttons"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadRoadmap}
          className="btn btn-primary"
        >
          📥 Download Roadmap
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/dashboard'}
          className="btn btn-secondary"
        >
          💬 Chat with AI Advisor
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSearchKeyword('');
            setDifficultyFilter('all');
            setExpandedPhase('foundation');
          }}
          className="btn btn-secondary"
        >
          🔄 Reset View
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CareerRoadmap;
