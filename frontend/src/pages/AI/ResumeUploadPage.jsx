import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar.jsx';
import { uploadResume } from '../../api/aiApi.js';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext.jsx';

const ResumeUploadPage = () => {
  const { theme } = useTheme();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, skills, roadmap, courses, preparation

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append('resume', file);
    try {
      const response = await uploadResume(fd);
      setAnalysis(response.data);
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Generate mock comprehensive data based on analysis
  const generateComprehensiveData = (analysisData) => {
    if (!analysisData) return null;
    
    const skills = analysisData.parsed?.technicalSkills || [];
    const experience = analysisData.parsed?.experience || [];
    
    return {
      ...analysisData,
      skillGaps: generateSkillGaps(skills),
      learningPath: generateLearningPath(skills),
      recommendedCourses: generateCourses(skills),
      certifications: generateCertifications(skills),
      placementPrep: generatePlacementPrep(skills),
      roadmap: generateRoadmap(skills),
      projectIdeas: generateProjects(skills),
      internships: generateInternships(skills)
    };
  };

  const generateSkillGaps = (skills) => {
    const industrySkills = [
      { skill: 'React', priority: 'High', reason: 'Essential for modern frontend development - used by Meta, Netflix, Airbnb', estimatedTime: '6-8 weeks', resources: ['React Official Docs', 'Scrimba React Course'] },
      { skill: 'Node.js', priority: 'High', reason: 'Backend JavaScript runtime - 85% of startups use it', estimatedTime: '5-7 weeks', resources: ['NodeJS.org', 'FreeCodeCamp Node'] },
      { skill: 'TypeScript', priority: 'High', reason: 'Industry standard for large codebases - required by 70% of companies', estimatedTime: '3-4 weeks', resources: ['TypeScript Handbook', 'Matt Pocock tutorials'] },
      { skill: 'Docker', priority: 'High', reason: 'Containerization essential for DevOps - required by most tech companies', estimatedTime: '4-6 weeks', resources: ['Docker Official Docs', 'TechWorld with Nana'] },
      { skill: 'AWS', priority: 'High', reason: 'Cloud computing leader - 65% market share in cloud services', estimatedTime: '8-10 weeks', resources: ['AWS Free Tier', 'A Cloud Guru'] },
      { skill: 'System Design', priority: 'High', reason: 'Critical for senior roles and FAANG interviews', estimatedTime: '10-12 weeks', resources: ['Grokking System Design', 'ByteByteGo'] },
      { skill: 'DSA', priority: 'High', reason: 'Mandatory for coding interviews at all product companies', estimatedTime: '12-16 weeks', resources: ['LeetCode', 'NeetCode'] },
      { skill: 'PostgreSQL', priority: 'Medium', reason: 'Most popular production database - used by Instagram, Uber', estimatedTime: '4-5 weeks', resources: ['PostgreSQL Tutorial', 'Hussein Nasser'] },
      { skill: 'Redis', priority: 'Medium', reason: 'Caching and session management - performance optimization', estimatedTime: '2-3 weeks', resources: ['Redis University', 'Redis Docs'] },
      { skill: 'Kubernetes', priority: 'Medium', reason: 'Container orchestration - standard for microservices', estimatedTime: '6-8 weeks', resources: ['Kubernetes.io', 'KodeKloud'] }
    ];
    
    const missing = industrySkills.filter(s => !skills.some(us => us.toLowerCase().includes(s.skill.toLowerCase())));
    return missing.slice(0, 6);
  };

  const generateLearningPath = (skills) => {
    const paths = [
      { title: 'Full Stack Developer', match: 85, duration: '6 months', modules: 12 },
      { title: 'Backend Engineer', match: 78, duration: '4 months', modules: 8 },
      { title: 'DevOps Engineer', match: 72, duration: '5 months', modules: 10 },
      { title: 'Data Engineer', match: 65, duration: '7 months', modules: 14 }
    ];
    return paths;
  };

  const generateCourses = (skills) => {
    return [
      { 
        title: 'CS50: Introduction to Computer Science', 
        provider: 'Harvard University (edX)', 
        rating: 4.9, 
        students: '4.5M', 
        price: 'Free', 
        duration: '12 weeks',
        link: 'https://cs50.harvard.edu/x/',
        description: 'Legendary CS fundamentals course'
      },
      { 
        title: 'Full Stack Open', 
        provider: 'University of Helsinki', 
        rating: 4.9, 
        students: '250K', 
        price: 'Free', 
        duration: '14 weeks',
        link: 'https://fullstackopen.com/',
        description: 'Modern web development with React, Node, MongoDB'
      },
      { 
        title: 'The Odin Project', 
        provider: 'The Odin Project', 
        rating: 4.8, 
        students: '500K', 
        price: 'Free', 
        duration: '6-9 months',
        link: 'https://www.theodinproject.com/',
        description: 'Complete full-stack curriculum with projects'
      },
      { 
        title: 'freeCodeCamp Certifications', 
        provider: 'freeCodeCamp', 
        rating: 4.8, 
        students: '5M+', 
        price: 'Free', 
        duration: '300+ hrs each',
        link: 'https://www.freecodecamp.org/learn',
        description: '10 free certifications with real projects'
      },
      { 
        title: 'JavaScript Algorithms & Data Structures', 
        provider: 'freeCodeCamp', 
        rating: 4.9, 
        students: '2M', 
        price: 'Free', 
        duration: '300 hrs',
        link: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
        description: 'Master DSA with JavaScript'
      },
      { 
        title: 'AWS Cloud Practitioner Essentials', 
        provider: 'AWS Skill Builder', 
        rating: 4.7, 
        students: '800K', 
        price: 'Free', 
        duration: '6 hrs',
        link: 'https://aws.amazon.com/training/digital/',
        description: 'Official AWS cloud fundamentals'
      },
      { 
        title: 'Google IT Automation with Python', 
        provider: 'Google (Coursera)', 
        rating: 4.8, 
        students: '600K', 
        price: 'Free Audit', 
        duration: '6 months',
        link: 'https://www.coursera.org/professional-certificates/google-it-automation',
        description: 'Python, Git, and automation from Google'
      },
      { 
        title: 'Meta Front-End Developer', 
        provider: 'Meta (Coursera)', 
        rating: 4.7, 
        students: '400K', 
        price: 'Free Audit', 
        duration: '7 months',
        link: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
        description: 'React and front-end from Meta engineers'
      }
    ];
  };

  const generateCertifications = (skills) => {
    return [
      { 
        name: 'AWS Certified Solutions Architect - Associate', 
        provider: 'Amazon Web Services', 
        difficulty: 'Intermediate', 
        value: 'Very High', 
        prepTime: '2-3 months',
        cost: '$150',
        link: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
        benefits: 'Opens doors to cloud roles, avg salary increase $15K'
      },
      { 
        name: 'Google Cloud Professional Cloud Architect', 
        provider: 'Google Cloud', 
        difficulty: 'Advanced', 
        value: 'Very High', 
        prepTime: '3-4 months',
        cost: '$200',
        link: 'https://cloud.google.com/certification/cloud-architect',
        benefits: 'Top-tier cloud cert, recognized globally'
      },
      { 
        name: 'Microsoft Azure Developer Associate', 
        provider: 'Microsoft', 
        difficulty: 'Intermediate', 
        value: 'High', 
        prepTime: '2-3 months',
        cost: '$165',
        link: 'https://learn.microsoft.com/en-us/certifications/azure-developer/',
        benefits: 'Essential for Azure development roles'
      },
      { 
        name: 'Certified Kubernetes Administrator (CKA)', 
        provider: 'CNCF', 
        difficulty: 'Advanced', 
        value: 'Very High', 
        prepTime: '3-4 months',
        cost: '$395',
        link: 'https://www.cncf.io/certification/cka/',
        benefits: 'Most valuable DevOps certification'
      },
      { 
        name: 'Oracle Certified Java Programmer', 
        provider: 'Oracle', 
        difficulty: 'Intermediate', 
        value: 'High', 
        prepTime: '2 months',
        cost: '$245',
        link: 'https://education.oracle.com/java-se-11-developer/pexam_1Z0-819',
        benefits: 'Standard for Java developers worldwide'
      },
      { 
        name: 'MongoDB Certified Developer', 
        provider: 'MongoDB University', 
        difficulty: 'Intermediate', 
        value: 'Medium', 
        prepTime: '1-2 months',
        cost: '$150',
        link: 'https://university.mongodb.com/certification',
        benefits: 'Validates NoSQL database expertise'
      }
    ];
  };

  const generatePlacementPrep = (skills) => {
    return {
      dsaProgress: 65,
      problemsSolved: 248,
      targetCompanies: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Netflix', 'Apple'],
      practiceResources: [
        { name: 'LeetCode', link: 'https://leetcode.com/', description: 'Essential for coding interviews - solve Easy→Medium→Hard', problems: '3000+' },
        { name: 'NeetCode 150', link: 'https://neetcode.io/', description: 'Curated list of top interview questions with video solutions', problems: '150' },
        { name: 'Blind 75', link: 'https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions', description: 'Must-solve questions for FAANG interviews', problems: '75' },
        { name: 'Striver A2Z DSA Sheet', link: 'https://takeuforward.org/strivers-a2z-dsa-course/', description: 'Complete DSA roadmap from basics to advanced', problems: '400+' },
        { name: 'Pramp', link: 'https://www.pramp.com/', description: 'Free peer-to-peer mock interviews', problems: 'Live' },
        { name: 'InterviewBit', link: 'https://www.interviewbit.com/', description: 'Topic-wise practice with company-specific questions', problems: '1000+' }
      ],
      interviewTips: [
        'Solve 2-3 LeetCode problems daily - consistency beats intensity',
        'Master patterns: Sliding Window, Two Pointers, Fast/Slow Pointers',
        'Practice system design: Start with Grokking System Design',
        'Mock interviews weekly - use Pramp or find interview partners',
        'Study behavioral questions using STAR method',
        'Build 2-3 production-ready projects for portfolio',
        'Contribute to open source - shows real-world collaboration',
        'Optimize LinkedIn - recruiters actively search there'
      ],
      upcomingDrives: [
        { company: 'Google', role: 'SDE-1', date: 'Rolling', ctc: '₹28-35 LPA', applyLink: 'https://careers.google.com/' },
        { company: 'Amazon', role: 'SDE-1', date: 'Rolling', ctc: '₹24-30 LPA', applyLink: 'https://amazon.jobs/' },
        { company: 'Microsoft', role: 'Software Engineer', date: 'Rolling', ctc: '₹26-32 LPA', applyLink: 'https://careers.microsoft.com/' },
        { company: 'Meta', role: 'Software Engineer', date: 'Rolling', ctc: '₹30-40 LPA', applyLink: 'https://www.metacareers.com/' },
        { company: 'Flipkart', role: 'SDE-2', date: 'Ongoing', ctc: '₹20-28 LPA', applyLink: 'https://www.flipkartcareers.com/' },
        { company: 'Atlassian', role: 'Software Engineer', date: 'Open', ctc: '₹25-35 LPA', applyLink: 'https://www.atlassian.com/company/careers' }
      ]
    };
  };

  const generateProjects = (skills) => {
    return [
      { 
        title: 'Real-time Chat Application', 
        tech: 'React, Socket.io, Node.js, MongoDB, JWT', 
        difficulty: 'Medium', 
        impact: 'High',
        github: 'https://github.com/adrianhajdin/project_chat_application',
        features: 'Real-time messaging, rooms, typing indicators, file sharing',
        learnings: 'WebSockets, real-time data, authentication'
      },
      { 
        title: 'Full-Stack E-commerce Platform', 
        tech: 'Next.js, Stripe, Sanity CMS, Tailwind', 
        difficulty: 'Advanced', 
        impact: 'Very High',
        github: 'https://github.com/adrianhajdin/ecommerce_sanity_stripe',
        features: 'Product catalog, cart, checkout, payment integration',
        learnings: 'Payment gateways, CMS, state management'
      },
      { 
        title: 'Netflix Clone with TMDB API', 
        tech: 'React, Firebase, TMDB API, Styled Components', 
        difficulty: 'Medium', 
        impact: 'High',
        github: 'https://github.com/CleverProgrammers/netflix-clone',
        features: 'Movie browsing, authentication, responsive design',
        learnings: 'API integration, Firebase auth, responsive UI'
      },
      { 
        title: 'Social Media Dashboard', 
        tech: 'MERN Stack, Redux, Socket.io, Cloudinary', 
        difficulty: 'Advanced', 
        impact: 'Very High',
        github: 'https://github.com/safak/youtube',
        features: 'Posts, comments, likes, real-time notifications, image uploads',
        learnings: 'Full CRUD, file uploads, complex state, real-time features'
      },
      { 
        title: 'DevOps CI/CD Pipeline', 
        tech: 'Jenkins, Docker, Kubernetes, Terraform, AWS', 
        difficulty: 'Advanced', 
        impact: 'Very High',
        github: 'https://github.com/Marcel-Jan/jenkins-kubernetes',
        features: 'Automated build, test, deploy, infrastructure as code',
        learnings: 'DevOps practices, containerization, orchestration, IaC'
      },
      { 
        title: 'AI Image Generator (Dall-E Clone)', 
        tech: 'React, Node.js, OpenAI API, MongoDB, Cloudinary', 
        difficulty: 'Advanced', 
        impact: 'Very High',
        github: 'https://github.com/adrianhajdin/project_ai_mern_image_generation',
        features: 'AI image generation, community gallery, download/share',
        learnings: 'AI API integration, image handling, community features'
      },
      { 
        title: 'Task Management System (Jira Clone)', 
        tech: 'React, Node.js, PostgreSQL, Prisma, TypeScript', 
        difficulty: 'Advanced', 
        impact: 'Very High',
        github: 'https://github.com/coding-to-music/jira-clone-nextjs-prisma',
        features: 'Kanban board, sprints, drag-drop, team collaboration',
        learnings: 'Complex UI, TypeScript, Prisma ORM, team workflows'
      },
      { 
        title: 'Video Streaming Platform', 
        tech: 'Next.js, Prisma, PostgreSQL, AWS S3, FFmpeg', 
        difficulty: 'Advanced', 
        impact: 'Very High',
        github: 'https://github.com/AntonioErdeljac/next13-airbnb-clone',
        features: 'Video upload, streaming, comments, likes, subscriptions',
        learnings: 'Video processing, CDN, scalable storage'
      }
    ];
  };

  const generateInternships = (skills) => {
    return [
      { 
        company: 'Google Summer of Code (GSoC)', 
        role: 'Open Source Contributor', 
        location: 'Remote', 
        match: 95, 
        stipend: '$1500-$6600',
        link: 'https://summerofcode.withgoogle.com/',
        duration: '10-22 weeks',
        description: 'Work with top open source organizations worldwide'
      },
      { 
        company: 'Microsoft', 
        role: 'Software Engineering Intern', 
        location: 'Bangalore/Hyderabad', 
        match: 92, 
        stipend: '₹80K-1L/month',
        link: 'https://careers.microsoft.com/students',
        duration: '2-3 months',
        description: 'Work on real Microsoft products and services'
      },
      { 
        company: 'Amazon', 
        role: 'SDE Intern', 
        location: 'Bangalore/Hyderabad', 
        match: 90, 
        stipend: '₹60K-80K/month',
        link: 'https://amazon.jobs/en/teams/internships-for-students',
        duration: '2-6 months',
        description: 'Build scalable solutions for millions of customers'
      },
      { 
        company: 'Flipkart', 
        role: 'Software Development Intern', 
        location: 'Bangalore', 
        match: 88, 
        stipend: '₹50K-70K/month',
        link: 'https://www.flipkartcareers.com/',
        duration: '2-6 months',
        description: 'Work on e-commerce at scale with top engineers'
      },
      { 
        company: 'Razorpay', 
        role: 'Full Stack Development Intern', 
        location: 'Bangalore', 
        match: 87, 
        stipend: '₹45K-60K/month',
        link: 'https://razorpay.com/jobs/',
        duration: '3-6 months',
        description: 'Build fintech products used by millions'
      },
      { 
        company: 'Atlassian', 
        role: 'Software Engineer Intern', 
        location: 'Bangalore', 
        match: 86, 
        stipend: '₹70K-90K/month',
        link: 'https://www.atlassian.com/company/careers/students',
        duration: '3-6 months',
        description: 'Contribute to Jira, Confluence, and other products'
      },
      { 
        company: 'Swiggy', 
        role: 'Backend Engineering Intern', 
        location: 'Bangalore', 
        match: 85, 
        stipend: '₹40K-55K/month',
        link: 'https://careers.swiggy.com/',
        duration: '2-6 months',
        description: 'Build high-scale food delivery systems'
      },
      { 
        platform: 'Internshala', 
        role: 'Browse 10,000+ Internships', 
        location: 'Pan India & Remote', 
        match: 100, 
        stipend: 'Varies',
        link: 'https://internshala.com/',
        duration: 'Varies',
        description: 'India\'s largest internship platform with verified opportunities'
      },
      { 
        platform: 'AngelList', 
        role: 'Startup Internships', 
        location: 'Bangalore/Remote', 
        match: 100, 
        stipend: 'Varies',
        link: 'https://angel.co/jobs',
        duration: 'Varies',
        description: 'Work with fast-growing startups and get equity'
      }
    ];
  };

  const generateRoadmap = (skills) => {
    return [
      { 
        phase: 'Foundation Phase',
        month: 'Month 1-2', 
        focus: 'DSA Fundamentals & Problem Solving', 
        tasks: ['Arrays & Strings', 'LinkedList & Recursion', 'Stacks & Queues', 'Sorting & Searching', 'Hashing & Two Pointers'],
        goals: ['Solve 50+ easy problems', 'Build strong foundation', 'Learn time/space complexity'],
        resources: ['LeetCode Easy', 'Striver A2Z DSA Sheet', 'Abdul Bari Videos'],
        milestones: ['Complete 50 problems', '90% accuracy on easy', 'Build confidence'],
        estimatedHours: '3-4 hours/day',
        status: 'current',
        progress: 65,
        color: 'from-green-500 to-emerald-500'
      },
      { 
        phase: 'Intermediate Phase',
        month: 'Month 3-4', 
        focus: 'Advanced DSA & Algorithms', 
        tasks: ['Binary Trees', 'Binary Search Trees', 'Graphs (BFS/DFS)', 'Dynamic Programming', 'Greedy & Backtracking'],
        goals: ['Master tree/graph algorithms', 'Solve 100+ medium problems', 'Pattern recognition'],
        resources: ['Neetcode 150', 'Blind 75', 'TakeUForward DSA Playlist'],
        milestones: ['150+ total problems', '70% accuracy on medium', 'Complete DP patterns'],
        estimatedHours: '4-5 hours/day',
        status: 'upcoming',
        progress: 0,
        color: 'from-blue-500 to-cyan-500'
      },
      { 
        phase: 'Advanced Phase',
        month: 'Month 5-6', 
        focus: 'System Design & Development', 
        tasks: ['Low Level Design (LLD)', 'High Level Design (HLD)', 'Database Design', 'Scalability & Caching', 'API Design'],
        goals: ['Design scalable systems', 'Learn design patterns', 'Build portfolio project'],
        resources: ['Grokking System Design', 'System Design Primer', 'ByteByteGo'],
        milestones: ['Complete 10 HLD problems', 'Build full-stack project', 'Learn microservices'],
        estimatedHours: '5-6 hours/day',
        status: 'upcoming',
        progress: 0,
        color: 'from-purple-500 to-pink-500'
      },
      { 
        phase: 'Specialization Phase',
        month: 'Month 7-8', 
        focus: 'Advanced Topics & Optimization', 
        tasks: ['Advanced DP', 'Segment Trees', 'Tries & Suffix Arrays', 'Hard Problems', 'Competitive Programming'],
        goals: ['Solve hard problems', 'Competitive coding', 'Build strong problem-solving'],
        resources: ['Codeforces', 'AtCoder', 'CSES Problem Set'],
        milestones: ['250+ total problems', 'Solve 20 hard problems', 'Contest participation'],
        estimatedHours: '4-5 hours/day',
        status: 'upcoming',
        progress: 0,
        color: 'from-orange-500 to-red-500'
      },
      { 
        phase: 'Project & Portfolio Phase',
        month: 'Month 9-10', 
        focus: 'Real-World Projects & Development', 
        tasks: ['Build 3 Full-Stack Projects', 'Add Advanced Features', 'Deploy to Cloud', 'Write Documentation', 'Open Source Contributions'],
        goals: ['Professional portfolio', 'Production experience', 'GitHub profile optimization'],
        resources: ['GitHub', 'AWS/Vercel', 'Docker & K8s', 'CI/CD Pipelines'],
        milestones: ['3 production projects', '100+ GitHub commits', 'Deployed applications'],
        estimatedHours: '5-6 hours/day',
        status: 'upcoming',
        progress: 0,
        color: 'from-teal-500 to-green-500'
      },
      { 
        phase: 'Interview Preparation Phase',
        month: 'Month 11-12', 
        focus: 'Mock Interviews & Job Applications', 
        tasks: ['Mock Technical Interviews', 'Behavioral Prep', 'Resume Optimization', 'LinkedIn Outreach', 'Apply to Companies'],
        goals: ['Ace interviews', 'Strong communication', 'Multiple job offers'],
        resources: ['Pramp', 'InterviewBit', 'Cracking the Coding Interview', 'Naukri/LinkedIn'],
        milestones: ['20+ applications', '10+ interviews', 'Job offer secured'],
        estimatedHours: '6-8 hours/day',
        status: 'upcoming',
        progress: 0,
        color: 'from-indigo-500 to-purple-500'
      }
    ];
  };

  const comprehensiveData = analysis ? generateComprehensiveData(analysis) : null;

  return (
    <div className="min-h-screen theme-bg" data-theme={theme}>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-10">
        <h1 className="text-xl font-bold mb-2 theme-text">AI Resume Upload</h1>
        <p className="mb-4 text-xs theme-text-muted">
          Upload your PDF/DOC resume. LearnBridge+ will parse your skills, projects, and experience to build a
          personalized learning path.
        </p>
        <form onSubmit={submit} className="space-y-3 text-xs">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-indigo-400"
          />
          <button
            type="submit"
            disabled={!file || loading}
            className="rounded-md bg-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Upload & Analyze'}
          </button>
        </form>

        {/* Comprehensive Analysis with Tabs */}
        {comprehensiveData && (
          <div className="mt-8">
            {/* Tabs Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { id: 'overview', label: '📊 Overview', icon: '📊' },
                { id: 'skills', label: '🎯 Skill Gaps', icon: '🎯' },
                { id: 'roadmap', label: '🗺️ Roadmap', icon: '🗺️' },
                { id: 'courses', label: '📚 Courses', icon: '📚' },
                { id: 'certifications', label: '🏆 Certifications', icon: '🏆' },
                { id: 'preparation', label: '💼 Placement Prep', icon: '💼' },
                { id: 'projects', label: '🚀 Projects', icon: '🚀' },
                { id: 'internships', label: '💡 Internships', icon: '💡' }
              ].map(tab => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                      : 'theme-card hover:bg-opacity-80'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* ATS Score Card */}
                    <div className="theme-card">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">ATS Score</h2>
                        <div className="text-3xl font-bold text-indigo-400">
                          {analysis.atsAnalysis?.atsScore || 0}/100
                        </div>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{backgroundColor: 'var(--bg-tertiary)'}}>
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          style={{ width: `${analysis.atsAnalysis?.atsScore || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Strengths & Weaknesses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.atsAnalysis?.strengths?.length > 0 && (
                        <div className="theme-card">
                          <h3 className="text-md font-bold mb-3 text-green-400"> Strengths</h3>
                          <ul className="space-y-2 text-sm">
                            {analysis.atsAnalysis.strengths.map((item, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-green-400 mr-2">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analysis.atsAnalysis?.weaknesses?.length > 0 && (
                        <div className="theme-card">
                          <h3 className="text-md font-bold mb-3 text-yellow-400"> Areas to Improve</h3>
                          <ul className="space-y-2 text-sm">
                            {analysis.atsAnalysis.weaknesses.map((item, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-yellow-400 mr-2">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Suggestions */}
                    {analysis.atsAnalysis?.suggestions?.length > 0 && (
                      <div className="theme-card">
                        <h3 className="text-md font-bold mb-3 text-blue-400"> Suggestions</h3>
                        <ul className="space-y-2 text-sm">
                          {analysis.atsAnalysis.suggestions.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-blue-400 mr-2">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Skills Summary */}
                    <div className="theme-card">
                      <h3 className="text-md font-bold mb-4"> Skills Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {analysis.parsed?.technicalSkills?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-indigo-400 mb-2">Technical Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysis.parsed.technicalSkills.slice(0, 10).map((skill, idx) => (
                                <span key={idx} className="px-2 py-1 rounded text-xs">{skill}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {analysis.parsed?.softSkills?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-purple-400 mb-2">Soft Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysis.parsed.softSkills.slice(0, 10).map((skill, idx) => (
                                <span key={idx} className="px-2 py  rounded text-xs">{skill}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Skill Gaps Tab */}
                {activeTab === 'skills' && comprehensiveData.skillGaps && (
                  <div className="space-y-4">
                    <div className="theme-card">
                      <h2 className="text-lg font-bold mb-4"> Skill Gap Analysis</h2>
                      <p className="text-sm theme-text-muted mb-6">Focus on these skills to boost your profile and land your dream job</p>
                      {comprehensiveData.skillGaps.map((gap, idx) => (
                        <motion.div 
                          key={idx} 
                          className="mb-4 p-4 rounded-lg border hover:border-indigo-500/50 transition-all" 
                          style={{backgroundColor: 'var(--bg-tertiary)'}}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-md">{gap.skill}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              gap.priority === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              gap.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-green-500/20 text-green-400 border border-green-500/30'
                            }`}>
                              {gap.priority} Priority
                            </span>
                          </div>
                          <p className="text-sm theme-text-muted mb-3">{gap.reason}</p>
                          <div className="flex items-center gap-4 text-xs mb-3">
                            <span className="text-indigo-400">⏱️ {gap.estimatedTime}</span>
                          </div>
                          {gap.resources && gap.resources.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-700">
                              <p className="text-xs font-semibold mb-2 text-blue-400">📚 Learning Resources:</p>
                              <div className="flex flex-wrap gap-2">
                                {gap.resources.map((resource, ridx) => (
                                  <span key={ridx} className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded text-xs border border-blue-500/30">
                                    {resource}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Learning Paths */}
                    <div className="theme-card">
                      <h2 className="text-lg font-bold mb-4"> Recommended Learning Paths</h2>
                      <div className="space-y-3">
                        {comprehensiveData.learningPath.map((path, idx) => (
                          <div key={idx} className="p-4 rounded-lg" style={{backgroundColor: 'var(--bg-tertiary)'}}>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{path.title}</h3>
                              <span className="text-indigo-400 font-bold">{path.match}% Match</span>
                            </div>
                            <div className="flex gap-4 text-xs theme-text-muted">
                              <span> {path.duration}</span>
                              <span> {path.modules} modules</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Roadmap Tab */}
                {activeTab === 'roadmap' && comprehensiveData.roadmap && (
                  <div className="space-y-8">
                    {/* Roadmap Header */}
                    <div className="theme-card text-center">
                      <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        🗺️ Complete 12-Month Career Roadmap
                      </h2>
                      <p className="text-sm theme-text-muted">Your journey from beginner to placement-ready professional</p>
                      <div className="flex justify-center gap-8 mt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-400">12</div>
                          <div className="text-xs theme-text-muted">Months</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">6</div>
                          <div className="text-xs theme-text-muted">Phases</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">300+</div>
                          <div className="text-xs theme-text-muted">Problems</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-400">5-6</div>
                          <div className="text-xs theme-text-muted">Hours/Day</div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                      {comprehensiveData.roadmap.map((phase, idx) => (
                        <motion.div 
                          key={idx} 
                          className="relative pl-12 pb-12"
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          {/* Timeline Line */}
                          {idx < comprehensiveData.roadmap.length - 1 && (
                            <div className={`absolute left-6 top-12 w-0.5 h-full bg-gradient-to-b ${phase.color}`} />
                          )}
                          
                          {/* Phase Number Badge */}
                          <div className={`absolute left-0 top-0 w-12 h-12 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                            {idx + 1}
                          </div>

                          {/* Phase Content Card */}
                          <div className={`theme-card relative overflow-hidden ${
                            phase.status === 'current' ? 'border-2 border-indigo-500 shadow-lg shadow-indigo-500/20' : ''
                          }`}>
                            {/* Header with gradient background */}
                            <div className={`p-4 bg-gradient-to-r ${phase.color} bg-opacity-10 border-b border-slate-700`}>
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-xl">{phase.phase}</h3>
                                    {phase.status === 'current' && (
                                      <motion.span 
                                        className="px-3 py-1 bg-indigo-500 rounded-full text-xs font-semibold flex items-center gap-1"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                      >
                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                        In Progress
                                      </motion.span>
                                    )}
                                  </div>
                                  <p className="text-sm theme-text-muted">{phase.month}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-semibold theme-text-muted">{phase.estimatedHours}</div>
                                  <div className="text-xs theme-text-muted">Time commitment</div>
                                </div>
                              </div>
                              <p className="text-md font-semibold text-indigo-300"> {phase.focus}</p>
                            </div>

                            {/* Progress Bar (for current phase) */}
                            {phase.status === 'current' && (
                              <div className="px-4 pt-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-semibold">Progress</span>
                                  <span className="text-sm font-bold text-indigo-400">{phase.progress}%</span>
                                </div>
                                <div className="h-2 rounded-full overflow-hidden" style={{backgroundColor: 'var(--bg-tertiary)'}}>
                                  <motion.div 
                                    className={`h-full bg-gradient-to-r ${phase.color}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${phase.progress}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Main Content Grid */}
                            <div className="p-4 space-y-4">
                              {/* Topics/Tasks */}
                              <div>
                                <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                                  <span className="text-purple-400"></span>
                                  Topics to Cover
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {phase.tasks.map((task, tidx) => (
                                    <span 
                                      key={tidx} 
                                      className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs font-medium border border-slate-700 transition-all cursor-default"
                                    >
                                      {task}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Goals */}
                              <div>
                                <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                                  <span className="text-green-400"></span>
                                  Goals
                                </h4>
                                <ul className="space-y-2">
                                  {phase.goals.map((goal, gidx) => (
                                    <li key={gidx} className="flex items-start text-sm">
                                      <span className="text-green-400 mr-2 mt-0.5">✓</span>
                                      <span>{goal}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Resources & Milestones Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Resources */}
                                <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--bg-tertiary)'}}>
                                  <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                                    <span className="text-blue-400"></span>
                                    Resources
                                  </h4>
                                  <ul className="space-y-1.5">
                                    {phase.resources.map((resource, ridx) => (
                                      <li key={ridx} className="flex items-center text-xs">
                                        <span className="text-blue-400 mr-2">→</span>
                                        <span>{resource}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Milestones */}
                                <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--bg-tertiary)'}}>
                                  <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                                    <span className="text-yellow-400"></span>
                                    Milestones
                                  </h4>
                                  <ul className="space-y-1.5">
                                    {phase.milestones.map((milestone, midx) => (
                                      <li key={midx} className="flex items-center text-xs">
                                        <span className="text-yellow-400 mr-2">★</span>
                                        <span>{milestone}</span>
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

                    {/* Success Message */}
                    <motion.div 
                      className="theme-card text-center p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="text-4xl mb-3"></div>
                      <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Journey Complete!
                      </h3>
                      <p className="text-sm theme-text-muted mb-4">
                        After completing this roadmap, you'll be ready for top tech companies
                      </p>
                      <div className="flex justify-center gap-4 text-xs">
                        <div className="px-4 py-2 bg-green-500/20 rounded-lg">
                          <div className="font-bold text-green-400">300+</div>
                          <div className="theme-text-muted">Problems Solved</div>
                        </div>
                        <div className="px-4 py-2 bg-blue-500/20 rounded-lg">
                          <div className="font-bold text-blue-400">3+</div>
                          <div className="theme-text-muted">Projects Built</div>
                        </div>
                        <div className="px-4 py-2 bg-purple-500/20 rounded-lg">
                          <div className="font-bold text-purple-400">10+</div>
                          <div className="theme-text-muted">Interviews</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Courses Tab */}
                {activeTab === 'courses' && comprehensiveData.recommendedCourses && (
                  <div className="theme-card">
                    <h2 className="text-lg font-bold mb-4"> Top Free Courses from World-Class Universities</h2>
                    <p className="text-sm theme-text-muted mb-6">Learn from Harvard, Stanford, MIT & more - all completely free!</p>
                    <div className="space-y-4">
                      {comprehensiveData.recommendedCourses.map((course, idx) => (
                        <motion.a 
                          key={idx} 
                          href={course.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 rounded-lg border border-slate-700 hover:border-indigo-500 transition-all cursor-pointer" 
                          style={{backgroundColor: 'var(--bg-tertiary)'}}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-bold text-md mb-1 text-indigo-300 hover:text-indigo-200">{course.title}</h3>
                              <p className="text-sm text-indigo-400 mb-2">{course.provider}</p>
                              {course.description && (
                                <p className="text-xs theme-text-muted mb-2">{course.description}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full font-bold text-sm border border-green-500/30">
                                {course.price}
                              </span>
                              <span className="text-xs text-blue-400 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Visit Course
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-4 text-xs theme-text-muted mt-3 pt-3 border-t border-slate-700">
                            <span className="flex items-center gap-1"> {course.rating}</span>
                            <span className="flex items-center gap-1"> {course.students} students</span>
                            <span className="flex items-center gap-1"> {course.duration}</span>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications Tab */}
                {activeTab === 'certifications' && comprehensiveData.certifications && (
                  <div className="theme-card">
                    <h2 className="text-lg font-bold mb-4"> Industry-Recognized Certifications</h2>
                    <p className="text-sm theme-text-muted mb-6">Boost your resume and salary with these valuable certifications</p>
                    <div className="space-y-4">
                      {comprehensiveData.certifications.map((cert, idx) => (
                        <motion.a
                          key={idx} 
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 rounded-lg border border-slate-700 hover:border-purple-500 transition-all" 
                          style={{backgroundColor: 'var(--bg-tertiary)'}}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)' }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-md mb-1 text-purple-300">{cert.name}</h3>
                              <p className="text-sm text-indigo-400 mb-2">{cert.provider}</p>
                              {cert.benefits && (
                                <p className="text-xs text-green-400 mb-2"> {cert.benefits}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                cert.value === 'Very High' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                                cert.value === 'High' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                              }`}>
                                {cert.value} Value
                              </span>
                              {cert.cost && (
                                <span className="text-xs text-yellow-400 font-semibold">{cert.cost}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-4 text-xs theme-text-muted pt-3 border-t border-slate-700">
                            <span> {cert.difficulty}</span>
                            <span>⏱ {cert.prepTime}</span>
                            <span className="text-blue-400 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Learn More
                            </span>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Placement Prep Tab */}
                {activeTab === 'preparation' && comprehensiveData.placementPrep && (
                  <div className="space-y-6">
                    {/* DSA Progress */}
                    <div className="theme-card">
                      <h2 className="text-lg font-bold mb-4"> DSA Progress</h2>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Problems Solved</span>
                        <span className="text-xl font-bold text-indigo-400">
                          {comprehensiveData.placementPrep.problemsSolved}
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden mb-4" style={{backgroundColor: 'var(--bg-tertiary)'}}>
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                          style={{ width: `${comprehensiveData.placementPrep.dsaProgress}%` }}
                        />
                      </div>
                      <p className="text-xs theme-text-muted">{comprehensiveData.placementPrep.dsaProgress}% Complete</p>
                    </div>

                    {/* Target Companies */}
                    <div className="theme-card">
                      <h2 className="text-lg font-bold mb-4"> Target Companies</h2>
                      <div className="flex flex-wrap gap-3">
                        {comprehensiveData.placementPrep.targetCompanies.map((company, idx) => (
                          <span key={idx} className="px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500 rounded-lg font-semibold">
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Practice Resources */}
                    {comprehensiveData.placementPrep.practiceResources && (
                      <div className="theme-card">
                        <h2 className="text-lg font-bold mb-4"> Coding Practice Platforms</h2>
                        <p className="text-sm theme-text-muted mb-4">Essential platforms to master DSA and interview preparation</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {comprehensiveData.placementPrep.practiceResources.map((resource, idx) => (
                            <motion.a
                              key={idx}
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-4 rounded-lg border border-slate-700 hover:border-green-500 transition-all"
                              style={{backgroundColor: 'var(--bg-tertiary)'}}
                              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-sm text-green-400">{resource.name}</h3>
                                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                                  {resource.problems}
                                </span>
                              </div>
                              <p className="text-xs theme-text-muted">{resource.description}</p>
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interview Tips */}
                    <div className="theme-card">
                      <h2 className="text-lg font-bold mb-4"> Pro Interview Tips</h2>
                      <ul className="space-y-3">
                        {comprehensiveData.placementPrep.interviewTips.map((tip, idx) => (
                          <motion.li 
                            key={idx} 
                            className="flex items-start p-3 rounded-lg" 
                            style={{backgroundColor: 'var(--bg-tertiary)'}}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <span className="text-green-400 mr-3 text-lg font-bold">✓</span>
                            <span className="text-sm">{tip}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Upcoming Drives */}
                    <div className="theme-card">
                      <h2 className="text-lg font-bold mb-4"> Top Tech Company Openings</h2>
                      <p className="text-sm theme-text-muted mb-4">Apply now to these top companies - positions are rolling!</p>
                      <div className="space-y-3">
                        {comprehensiveData.placementPrep.upcomingDrives.map((drive, idx) => (
                          <motion.a
                            key={idx}
                            href={drive.applyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 hover:border-indigo-400 transition-all"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-bold text-md text-indigo-300">{drive.company}</h3>
                              <span className="text-green-400 font-bold text-sm">{drive.ctc}</span>
                            </div>
                            <div className="flex gap-4 text-sm theme-text-muted mb-3">
                              <span> {drive.role}</span>
                              <span> {drive.date}</span>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                              <span className="text-xs theme-text-muted">Click to apply</span>
                              <span className="text-xs text-blue-400 flex items-center gap-1 font-semibold">
                                Apply Now →
                              </span>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && comprehensiveData.projectIdeas && (
                  <div className="theme-card">
                    <h2 className="text-lg font-bold mb-4"> Portfolio Project Ideas with Source Code</h2>
                    <p className="text-sm theme-text-muted mb-6">Build impressive projects to stand out - complete with GitHub repos and tutorials</p>
                    <div className="space-y-4">
                      {comprehensiveData.projectIdeas.map((project, idx) => (
                        <motion.a
                          key={idx}
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-5 rounded-lg border border-slate-700 hover:border-orange-500 transition-all" 
                          style={{backgroundColor: 'var(--bg-tertiary)'}}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.08 }}
                          whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(251, 146, 60, 0.4)' }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-md text-orange-300 mb-2">{project.title}</h3>
                              <p className="text-sm text-indigo-400 mb-2">📦 {project.tech}</p>
                              {project.features && (
                                <p className="text-xs theme-text-muted mb-2">✨ {project.features}</p>
                              )}
                              {project.learnings && (
                                <p className="text-xs text-green-400"> Learn: {project.learnings}</p>
                              )}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ml-3 ${
                              project.impact === 'Very High' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                              'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                            }`}>
                              {project.impact} Impact
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                            <span className="text-xs theme-text-muted">Difficulty: {project.difficulty}</span>
                            <span className="flex items-center gap-2 text-xs text-orange-400 font-semibold">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                              View on GitHub
                            </span>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Internships Tab */}
                {activeTab === 'internships' && comprehensiveData.internships && (
                  <div className="theme-card">
                    <h2 className="text-lg font-bold mb-4"> Top Internship Opportunities</h2>
                    <p className="text-sm theme-text-muted mb-6">Premium internships from leading tech companies - apply directly!</p>
                    <div className="space-y-4">
                      {comprehensiveData.internships.map((intern, idx) => (
                        <motion.a
                          key={idx}
                          href={intern.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-5 rounded-lg border border-slate-700 hover:border-cyan-500 transition-all" 
                          style={{backgroundColor: 'var(--bg-tertiary)'}}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(34, 211, 238, 0.4)' }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-md mb-1 text-cyan-300">{intern.company || intern.platform}</h3>
                              <p className="text-sm text-indigo-400 mb-2">{intern.role}</p>
                              {intern.description && (
                                <p className="text-xs theme-text-muted mb-2">{intern.description}</p>
                              )}
                            </div>
                            <div className="text-right ml-3">
                              <div className="text-green-400 font-bold text-sm mb-1">{intern.stipend}</div>
                              <div className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs font-semibold">
                                {intern.match}% match
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                            <div className="flex gap-3 text-xs theme-text-muted">
                              <span>📍 {intern.location}</span>
                              {intern.duration && <span>⏱️ {intern.duration}</span>}
                            </div>
                            <span className="text-xs text-cyan-400 flex items-center gap-1 font-semibold">
                              Apply Now →
                            </span>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadPage;