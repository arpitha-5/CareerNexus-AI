import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { motion } from 'framer-motion';

const InterviewBotPage = () => {
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('entry');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQuestions = () => {
    setLoading(true);
    setTimeout(() => {
      setResult({
        interviewRounds: [
          {
            round: 'HR & Behavioral Round',
            duration: '30 minutes',
            questions: [
              {
                question: 'Tell me about yourself and your journey into tech.',
                expectedAnswer: 'Start with education, mention key projects/internships, highlight technical skills learned, end with career goals. Keep it 2-3 minutes.',
                tips: ['Focus on professional journey', 'Mention measurable achievements', 'Connect past experiences to target role'],
                difficulty: 'easy'
              },
              {
                question: 'Describe a challenging project you worked on. How did you overcome obstacles?',
                expectedAnswer: 'Use STAR method (Situation, Task, Action, Result). Mention specific technical challenges, your approach, and quantifiable outcomes.',
                tips: ['Be specific with numbers (30% performance improvement, etc.)', 'Highlight teamwork and communication', 'Show problem-solving skills'],
                difficulty: 'medium'
              },
              {
                question: 'Where do you see yourself in 5 years?',
                expectedAnswer: 'Show ambition aligned with company growth. Mention technical expertise goals, leadership aspirations, and continuous learning.',
                tips: ['Research company growth trajectory', 'Balance ambition with realism', 'Mention specific technologies you want to master'],
                difficulty: 'easy'
              },
              {
                question: 'Why should we hire you over other candidates?',
                expectedAnswer: 'Highlight unique combination of skills, relevant project experience, cultural fit, and genuine enthusiasm for the role.',
                tips: ['Reference specific job requirements', 'Mention your learning agility', 'Show you researched the company'],
                difficulty: 'medium'
              }
            ]
          },
          {
            round: 'Technical Round 1 - Fundamentals',
            duration: '45 minutes',
            questions: [
              {
                question: 'Explain the event loop in JavaScript and how async/await works.',
                expectedAnswer: 'JS is single-threaded. Event loop handles async operations via call stack, web APIs, and callback queue. async/await is syntactic sugar over promises, making async code look synchronous.',
                tips: ['Draw diagrams if asked', 'Mention microtasks vs macrotasks', 'Give examples of setTimeout vs Promise'],
                difficulty: 'medium'
              },
              {
                question: 'What is the difference between SQL and NoSQL databases? When would you use each?',
                expectedAnswer: 'SQL: structured data, ACID compliance, complex queries (PostgreSQL, MySQL). NoSQL: flexible schema, horizontal scaling, high performance (MongoDB, Redis). Use SQL for transactions, NoSQL for real-time apps.',
                tips: ['Mention CAP theorem', 'Give real-world examples', 'Discuss trade-offs'],
                difficulty: 'medium'
              },
              {
                question: 'Explain RESTful API principles and HTTP methods.',
                expectedAnswer: 'REST uses HTTP methods (GET, POST, PUT, DELETE) for CRUD operations. Stateless, cacheable, uniform interface. Resource-based URLs, proper status codes (200, 404, 500).',
                tips: ['Mention idempotency', 'Discuss API versioning', 'Compare with GraphQL if asked'],
                difficulty: 'easy'
              },
              {
                question: 'What are closures in JavaScript? Provide a practical use case.',
                expectedAnswer: 'Function that remembers variables from outer scope even after outer function returns. Used in data encapsulation, currying, callback functions.',
                tips: ['Provide code example', 'Mention memory implications', 'Discuss module pattern'],
                difficulty: 'hard'
              }
            ]
          },
          {
            round: 'Technical Round 2 - System Design',
            duration: '60 minutes',
            questions: [
              {
                question: 'Design a URL shortener like bit.ly. Explain your approach.',
                expectedAnswer: 'Hash function for short codes, database (key-value store like Redis), redirect logic, analytics tracking. Discuss scalability, collision handling, and caching.',
                tips: ['Start with requirements (read-heavy? write-heavy?)', 'Draw architecture diagram', 'Mention load balancing'],
                difficulty: 'hard'
              },
              {
                question: 'How would you design a real-time chat application?',
                expectedAnswer: 'WebSocket for real-time bidirectional communication, message queue (RabbitMQ/Kafka), database for persistence, presence detection, read receipts.',
                tips: ['Discuss scalability with millions of users', 'Mention offline message handling', 'Consider CDN for media'],
                difficulty: 'hard'
              },
              {
                question: 'Explain how you would implement rate limiting in an API.',
                expectedAnswer: 'Token bucket or sliding window algorithm. Store request counts in Redis with TTL. Return 429 status when limit exceeded. Consider user tier-based limits.',
                tips: ['Mention different strategies (IP-based, user-based)', 'Discuss distributed systems challenges', 'Consider DDoS protection'],
                difficulty: 'medium'
              }
            ]
          },
          {
            round: 'Coding Round',
            duration: '60 minutes',
            questions: [
              {
                question: 'Given an array of integers, find two numbers that add up to a target sum.',
                expectedAnswer: 'Use hash map to store seen numbers. For each num, check if (target - num) exists in map. Time: O(n), Space: O(n)',
                tips: ['Clarify if array is sorted', 'Ask about duplicate numbers', 'Optimize for space if needed'],
                difficulty: 'easy',
                solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`
              },
              {
                question: 'Implement a function to reverse a linked list.',
                expectedAnswer: 'Iterative: Use three pointers (prev, current, next). Reverse direction while traversing. Time: O(n), Space: O(1)',
                tips: ['Draw diagram', 'Handle edge cases (empty list)', 'Mention recursive approach'],
                difficulty: 'medium',
                solution: `function reverseList(head) {
  let prev = null;
  let current = head;
  while (current !== null) {
    let next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}`
              },
              {
                question: 'Find the longest substring without repeating characters.',
                expectedAnswer: 'Sliding window with hash set. Expand window when no duplicates, shrink when duplicate found. Track max length.',
                tips: ['Clarify character set (ASCII? Unicode?)', 'Optimize pointer movement', 'Discuss time complexity'],
                difficulty: 'medium',
                solution: `function lengthOfLongestSubstring(s) {
  const set = new Set();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left++]);
    }
    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`
              }
            ]
          }
        ],
        preparationTips: [
          'Practice mock interviews with peers',
          'Use STAR method for behavioral questions',
          'Solve 2-3 LeetCode problems daily',
          'Review company tech stack and recent projects',
          'Prepare questions to ask the interviewer',
          'Test your setup (camera, mic, internet) before virtual interviews'
        ],
        commonMistakes: [
          'Not asking clarifying questions',
          'Jumping to code without discussing approach',
          'Ignoring edge cases',
          'Poor time management',
          'Speaking too much or too little'
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="text-5xl">🎤</div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                AI Interview Bot
              </h1>
              <p className="text-slate-400 mt-1">Practice with HR, technical, and coding interview questions</p>
            </div>
          </div>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-3">Target Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Full-Stack Developer, Frontend Engineer, Backend Developer..."
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-slate-100 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3">Experience Level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-slate-100 focus:border-orange-500 focus:outline-none"
              >
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (2-5 years)</option>
                <option value="senior">Senior Level (5+ years)</option>
              </select>
            </div>
            <button
              onClick={generateQuestions}
              disabled={loading || !role}
              className="mt-4 w-full rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3 font-semibold text-white hover:from-red-500 hover:to-orange-500 disabled:opacity-50 transition"
            >
              {loading ? 'Generating Questions...' : '🎤 Generate Interview Questions'}
            </button>
          </div>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            {/* Interview Rounds */}
            {result.interviewRounds.map((round, ridx) => (
              <motion.div
                key={ridx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ridx * 0.1 }}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-orange-400">{round.round}</h3>
                  <span className="text-sm text-slate-400">⏱️ {round.duration}</span>
                </div>
                <div className="space-y-4">
                  {round.questions.map((q, qidx) => (
                    <div key={qidx} className="rounded-lg bg-slate-800/50 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-slate-100">Q{qidx + 1}: {q.question}</div>
                        {q.difficulty && (
                          <span className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ml-2 ${
                            q.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                            q.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {q.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 p-3 rounded bg-slate-900/50">
                        <div className="text-xs font-semibold text-slate-400 mb-1">💡 Expected Answer:</div>
                        <div className="text-sm text-slate-300">{q.expectedAnswer}</div>
                      </div>
                      <div className="mt-3">
                        <div className="text-xs font-semibold text-slate-400 mb-2">✨ Tips:</div>
                        <ul className="space-y-1">
                          {q.tips.map((tip, tidx) => (
                            <li key={tidx} className="text-sm text-slate-300 flex items-start gap-2">
                              <span className="text-orange-400">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {q.solution && (
                        <div className="mt-3 p-3 rounded bg-slate-950">
                          <div className="text-xs font-semibold text-slate-400 mb-2">💻 Solution:</div>
                          <pre className="text-xs text-slate-100 font-mono overflow-x-auto whitespace-pre-wrap">
                            {q.solution}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Preparation Tips */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-red-900/30 to-orange-900/30 p-6">
              <h3 className="text-xl font-bold mb-4">🎯 Preparation Tips</h3>
              <ul className="space-y-2">
                {result.preparationTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-xl font-bold mb-4">⚠️ Common Mistakes to Avoid</h3>
              <ul className="space-y-2">
                {result.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <Link
                to="/ai/code-mentor"
                className="flex-1 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3 text-center font-semibold text-white hover:from-red-500 hover:to-orange-500 transition"
              >
                👨‍💻 Practice with Code Mentor
              </Link>
              <Link
                to="/dashboard"
                className="flex-1 rounded-lg border border-slate-700 px-6 py-3 text-center font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InterviewBotPage;
