import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post, typingUser }) => {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-200 relative">
      {typingUser && (
        <div className="absolute top-2 right-2 text-[10px] text-emerald-400 animate-pulse">
          {typingUser} is typing...
        </div>
      )}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-slate-800 text-[11px] flex items-center justify-center">
            {post.author?.name?.[0] || 'U'}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-100">
              {post.author?.name || 'Student'}
            </p>
            <p className="text-[10px] text-slate-500">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        {post.facultyVerified && (
          <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300 border border-emerald-500/40">
            Faculty Verified
          </span>
        )}
      </div>
      <Link to={`/community/${post._id}`}>
        <h3 className="mb-1 text-sm font-semibold text-slate-50 hover:text-indigo-300">
          {post.title}
        </h3>
      </Link>
      <p className="mb-2 line-clamp-2 text-[11px] text-slate-300">{post.content}</p>
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex flex-wrap gap-1">
          {post.tags?.map((t) => (
            <span
              key={t}
              className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] text-sky-200 border border-sky-500/25"
            >
              #{t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>❤️ {post.likes?.length || 0}</span>
          <span>💬 {post.commentsCount ?? 0}</span>
        </div>
      </div>
    </article>
  );
};

export default PostCard;