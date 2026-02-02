import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { motion } from 'framer-motion';

const CodeMentorPage = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeCode = () => {
    setLoading(true);
    setTimeout(() => {
      setResult({
        issues: [
          {
            severity: 'error',
            line: 5,
            message: 'Undefined variable "userName"',
            explanation: 'The variable is used before being declared. This will cause a ReferenceError at runtime.',
            fix: 'Declare the variable before using it: const userName = data.name;'
          },
          {
            severity: 'warning',
            line: 12,
            message: 'Using var instead of const/let',
            explanation: 'var has function scope which can lead to unexpected behavior. Use const for constants and let for variables.',
            fix: 'Replace var with const or let based on mutability needs'
          },
          {
            severity: 'warning',
            line: 18,
            message: 'Missing error handling in async function',
            explanation: 'Async operations should always handle errors to prevent unhandled promise rejections.',
            fix: 'Wrap in try-catch block or add .catch() handler'
          }
        ],
        optimizedCode: `// Optimized version with fixes
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    const userName = data.name; // Fixed: declared before use
    
    // Use const instead of var
    const userProfile = {
      id: userId,
      name: userName,
      email: data.email
    };
    
    return userProfile;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error; // Proper error handling
  }
}`,
        improvements: [
          { title: 'Error Handling', description: 'Added try-catch block to handle network errors and invalid responses', impact: 'high' },
          { title: 'Variable Declarations', description: 'Replaced var with const/let for better scoping', impact: 'medium' },
          { title: 'Response Validation', description: 'Check response.ok before parsing JSON', impact: 'high' },
          { title: 'Code Clarity', description: 'Added comments and better variable names', impact: 'low' }
        ],
        complexity: {
          timeBefore: 'O(1)',
          timeAfter: 'O(1)',
          spaceBefore: 'O(1)',
          spaceAfter: 'O(1)',
          improvement: 'No complexity change, but added error handling'
        },
        bestPractices: [
          'Always validate API responses',
          'Use async/await with try-catch',
          'Prefer const over let, never use var',
          'Add meaningful error messages',
          'Use template literals for string interpolation'
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
            <div className="text-5xl">👨‍💻</div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                AI Code Mentor
              </h1>
              <p className="text-slate-400 mt-1">Debug, optimize, and learn best practices from your code</p>
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
              <label className="block text-sm font-semibold mb-3">Programming Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="typescript">TypeScript</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3">Your Code</label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here... I'll help you debug and optimize it!"
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-slate-100 font-mono focus:border-emerald-500 focus:outline-none resize-none"
                rows="12"
              />
            </div>
            <button
              onClick={analyzeCode}
              disabled={loading || !code}
              className="mt-4 w-full rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 transition"
            >
              {loading ? 'Analyzing Code...' : '👨‍💻 Analyze & Optimize'}
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
            {/* Issues Found */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-xl font-bold mb-4">🔍 Issues Found</h3>
              <div className="space-y-3">
                {result.issues.map((issue, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="rounded-lg bg-slate-800/50 p-4 border-l-4"
                    style={{
                      borderLeftColor: issue.severity === 'error' ? '#ef4444' : '#f59e0b'
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          issue.severity === 'error' 
                            ? 'bg-red-500/20 text-red-300' 
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {issue.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400">Line {issue.line}</span>
                      </div>
                    </div>
                    <div className="font-semibold mb-2">{issue.message}</div>
                    <div className="text-sm text-slate-300 mb-2">{issue.explanation}</div>
                    <div className="text-sm bg-slate-900/50 rounded p-2 font-mono">
                      💡 Fix: {issue.fix}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Optimized Code */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-xl font-bold mb-4">✨ Optimized Code</h3>
              <div className="rounded-lg bg-slate-950 p-4 overflow-x-auto">
                <pre className="text-sm text-slate-100 font-mono whitespace-pre-wrap">
                  {result.optimizedCode}
                </pre>
              </div>
            </div>

            {/* Improvements */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-xl font-bold mb-4">🚀 Improvements Made</h3>
              <div className="space-y-3">
                {result.improvements.map((improvement, idx) => (
                  <div key={idx} className="rounded-lg bg-slate-800/50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{improvement.title}</div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        improvement.impact === 'high' ? 'bg-green-500/20 text-green-300' :
                        improvement.impact === 'medium' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-slate-500/20 text-slate-300'
                      }`}>
                        {improvement.impact} impact
                      </span>
                    </div>
                    <div className="text-sm text-slate-300">{improvement.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complexity Analysis */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-xl font-bold mb-4">⚡ Complexity Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-800/50 p-4">
                  <div className="text-slate-400 text-sm mb-2">Time Complexity</div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 line-through">{result.complexity.timeBefore}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-green-400 font-semibold">{result.complexity.timeAfter}</span>
                  </div>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-4">
                  <div className="text-slate-400 text-sm mb-2">Space Complexity</div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 line-through">{result.complexity.spaceBefore}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-green-400 font-semibold">{result.complexity.spaceAfter}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-300">
                💡 {result.complexity.improvement}
              </div>
            </div>

            {/* Best Practices */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6">
              <h3 className="text-xl font-bold mb-4">📚 Best Practices to Remember</h3>
              <ul className="space-y-2">
                {result.bestPractices.map((practice, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <Link
                to="/ai/project-generator"
                className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-center font-semibold text-white hover:from-green-500 hover:to-emerald-500 transition"
              >
                🚀 Generate Project Ideas
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

export default CodeMentorPage;
