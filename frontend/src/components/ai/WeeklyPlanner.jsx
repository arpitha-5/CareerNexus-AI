// WeeklyPlanner.jsx
import React from 'react';

const WeeklyPlanner = ({ learningPath = [] }) => {
  if (!learningPath.length) {
    return <p className="text-xs text-slate-400">No learning path yet. Generate to get started.</p>;
  }

  return (
    <div className="space-y-4 text-xs">
      {learningPath.map((week) => (
        <div
          key={week.week}
          className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:flex-row"
        >
          <div className="md:w-24">
            <p className="text-[10px] uppercase text-slate-400">Week</p>
            <p className="text-2xl font-bold text-indigo-300">{week.week}</p>
          </div>
          <div className="grid flex-1 gap-3 md:grid-cols-3">
            <div>
              <p className="mb-1 font-semibold text-slate-200">Topics</p>
              <ul className="space-y-1 text-slate-300">
                {week.topics.map((t) => (
                  <li key={t}>• {t}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 font-semibold text-slate-200">Projects</p>
              <ul className="space-y-1 text-slate-300">
                {week.projects.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 font-semibold text-slate-200">Practice &amp; Quizzes</p>
              <ul className="space-y-1 text-slate-300">
                {week.practice.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
                {week.quizzes?.map((q) => (
                  <li key={q}>🧠 {q}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeeklyPlanner;