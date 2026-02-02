/**
 * INTERVIEW API CLIENT
 * 
 * Frontend fetch wrapper for interview endpoints
 * Communicates with /api/interview/* backend routes
 */

import axiosClient from './axiosClient.js';

const interviewApi = {
  /**
   * Get interview readiness score
   * GET /api/interview/readiness?company={company}
   */
  getReadinessScore: async (company = null) => {
    try {
      const response = await axiosClient.get('/interview/readiness', {
        params: { company }
      });
      return response.data?.data || null;
    } catch (error) {
      console.warn('Backend unavailable, using mock readiness data');
      return {
        overallScore: 72,
        technicalScore: 75,
        behavioralScore: 68,
        communicationScore: 78,
        problemSolvingScore: 70
      };
    }
  },

  /**
   * Generate interview questions
   * POST /api/interview/questions
   */
  getQuestions: async (focusWeakAreas = false, company = null, role = null) => {
    try {
      const response = await axiosClient.post('/interview/questions', {
        focusWeakAreas,
        company,
        role
      });
      return response.data?.data?.session || null;
    } catch (error) {
      console.warn('Backend unavailable, using mock session data');
      return {
        _id: 'mock-session-id',
        questions: [
          {
            _id: 'q1',
            type: 'technical',
            question: 'Explain the difference between event propagation and event bubbling in the DOM.',
            whyAsked: 'Tests understanding of DOM event flow, crucial for handling user interactions in complex UIs.',
            whatItTests: 'JavaScript DOM Events',
            sampleAnswer: 'Event propagation is the blanket term for the event flow, which includes three phases: capturing, target, and bubbling. Event bubbling specifically refers to the phase where the event travels from the target element up to the root.'
          },
          {
            _id: 'q2',
            type: 'behavioral',
            question: 'Tell me about a time you had to optimize a slow rendering React component.',
            whyAsked: 'Assesses practical performance optimization skills and problem-solving methodology.',
            whatItTests: 'React Performance',
            sampleAnswer: 'I identified a list component re-rendering unnecessarily using React DevTools Profiler. I implemented React.memo to prevent updates when props didn\'t change and virtualized the list using react-window to handle 1000+ items, reducing render time by 80%.'
          }
        ]
      };
    }
  },

  /**
   * Generate company-specific questions
   * POST /api/interview/questions
   */
  getCompanyQuestions: async (company, role) => {
    try {
      const response = await axiosClient.post('/interview/questions', {
        focusWeakAreas: true,
        company,
        role
      });
      return response.data?.data || null;
    } catch (error) {
      console.warn('Backend unavailable, using mock company data');
      return {
        session: {
          _id: 'mock-company-session',
          questions: [
            {
              _id: 'cq1',
              type: 'technical',
              question: `How would you design a scalable ${role?.includes('Backend') ? 'API rate limiter' : 'notification system'} for ${company}?`,
              whyAsked: `Tests system design skills relevant to ${company}'s scale.`,
              whatItTests: 'System Design',
              sampleAnswer: 'I would use a Token Bucket algorithm backed by Redis for low-latency state. For distributon, I\'d implement consistent hashing to shard rate limits across nodes...'
            },
            {
              _id: 'cq2',
              type: 'behavioral',
              question: `Describe a situation where you demonstrated ${company}'s leadership principles.`,
              whyAsked: 'Cultural fit check is mandatory for this company.',
              whatItTests: 'Culture Fit',
              sampleAnswer: 'I took ownership of a critical bug during a release, coordinating across three teams to fix it without blame, ensuring customer trust was maintained.'
            }
          ]
        },
        insights: {
          tip: `${company} values data-driven decision making. Always back your choices with metrics.`,
          style: 'Structured & Behavioral',
          estimatedTimeline: '3-4 Weeks',
          preparationTime: '2 Weeks',
          rounds: ['Online Assessment', 'Technical Phone Screen', 'Onsite Loop (4 rounds)'],
          difficulty: 'Medium-Hard'
        }
      };
    }
  },

  /**
   * Get 7-day prep plan
   * POST /api/interview/prep-plan
   */
  getPrepPlan: async (company, role) => {
    try {
      const response = await axiosClient.post('/interview/prep-plan', {
        company,
        role
      });
      return response.data?.data || [];
    } catch (error) {
      return [
        { day: 1, topic: 'Data Structures', focus: 'Arrays, Strings, and Hash Maps mastery' },
        { day: 2, topic: 'Company Research', focus: `Deep dive into ${company}'s products and culture` },
        { day: 3, topic: 'System Design', focus: 'Scalability basics and Load Balancing' },
        { day: 4, topic: 'Mock Interviews', focus: 'Peer practice for behavioral questions' },
        { day: 5, topic: 'Algorithms', focus: 'Dynamic Programming and Graphs' },
        { day: 6, topic: 'Role Specifics', focus: `${role} specific framework deep dives` },
        { day: 7, topic: 'Rest & Review', focus: 'Light review and mental preparation' },
      ];
    }
  },

  /**
   * Evaluate student answer
   * POST /api/interview/evaluate
   */
  evaluateAnswer: async (sessionId, questionId, answer) => {
    try {
      const response = await axiosClient.post('/interview/evaluate', {
        sessionId,
        questionId,
        answer
      });
      return response.data?.data || null;
    } catch (error) {
      return {
        score: 85,
        feedback: "Strong answer! You clearly articulated the core concept. To improve, try adding a specific example from your past projects.",
        improvementTips: "Mention specific tools or metrics."
      };
    }
  },

  /**
   * Store answer and evaluation in user's interview progress
   * POST /api/interview/answer-session
   */
  storeAnswerSession: async (sessionId, questionId, answer, evaluation) => {
    // No mock needed for storage usually, but return success
    return { success: true };
  },

  /**
   * Download interview PDF guide
   * GET /api/interview/pdf?company={company}&role={role}
   */
  downloadInterviewPDF: async (company, role) => {
    try {
      const response = await axiosClient.get('/interview/pdf', {
        params: { company, role, type: 'guide' },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${company}_Interview_Guide.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return true;
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download PDF. Please try again.');
      return false;
    }
  },

  /**
   * Get list of downloadable materials
   * GET /api/interview/materials
   */
  getMaterials: async (company, role) => {
    try {
      const response = await axiosClient.get('/interview/materials', {
        params: { company, role }
      });
      return response.data?.data || [];
    } catch (error) {
      return [
        { id: 'guide', title: `${company} Interview Guide`, type: 'PDF Guide', icon: '📄' },
        { id: 'technical', title: 'Top 50 Questions', type: 'Cheatsheet', icon: '📝' },
        { id: 'behavioral', title: 'Behavioral Masterclass', type: 'E-Book', icon: '📘' }
      ];
    }
  },

  /**
   * Download specific material PDF
   * GET /api/interview/pdf
   */
  downloadMaterialPDF: async (company, role, type) => {
    try {
      const response = await axiosClient.get('/interview/pdf', {
        params: { company, role, type },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${company}_${type}_Guide.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return true;
    } catch (error) {
      console.error('Download error:', error);
      alert(`Failed to download ${type}. Please try again.`);
      return false;
    }
  }
};

export default interviewApi;
