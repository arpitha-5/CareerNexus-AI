import React from 'react';

const RoleCTAButtons = ({ onStudent, onAdmin }) => (
  <div className="flex flex-wrap gap-3 text-sm">
    <button
      onClick={onStudent}
      className="rounded-full bg-indigo-500 px-4 py-2 font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400"
    >
      Join Now
    </button>
  </div>
);

export default RoleCTAButtons;