// AdaptiveLevelIndicator.jsx
import React from 'react';

const AdaptiveLevelIndicator = ({ difficulty, speedLabel }) => {
  const diffColor =
    difficulty === 'easy'
      ? 'bg-emerald-500/20 text-emerald-200'
      : difficulty === 'hard'
      ? 'bg-rose-500/20 text-rose-200'
      : 'bg-amber-500/20 text-amber-200';

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
      <div>
        <p className="text-[10px] uppercase text-slate-400">Difficulty</p>
        <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${diffColor}`}>
          {difficulty?.toUpperCase()}
        </span>
      </div>
      <div>
        <p className="text-[10px] uppercase text-slate-400">Learning Speed</p>
        <p className="mt-1 text-lg font-semibold text-sky-300">{speedLabel}</p>
      </div>
      <p className="max-w-xs text-[11px] text-slate-400">
        The engine reviews your quiz scores, study time, and streak every week to re-balance your plan.
      </p>
    </div>
  );
};

export default AdaptiveLevelIndicator;