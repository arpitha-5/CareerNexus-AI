import React from 'react';

const CommentList = ({ comments }) => {
  if (!comments?.length) {
    return <p className="text-[11px] text-slate-500">No replies yet. Be the first to answer.</p>;
  }

  return (
    <ul className="space-y-2 text-xs text-slate-200">
      {comments.map((c) => (
        <li
          key={c._id}
          className="rounded-xl bg-slate-950/80 px-3 py-2 border border-slate-800/80"
        >
          <div className="mb-1 flex items-center justify-between">
            <p className="text-[11px] font-semibold text-slate-100">
              {c.author?.name || 'User'}
            </p>
            <p className="text-[10px] text-slate-500">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </div>
          <p className="text-[11px] text-slate-200">{c.content}</p>
        </li>
      ))}
    </ul>
  );
};

export default CommentList;