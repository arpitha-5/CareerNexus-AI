import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-400">
      <div className="mx-auto max-w-6xl px-4 text-center space-y-4">

        {/* LINKS */}
        <div className="flex items-center justify-center gap-8">
          <a href="#privacy" className="hover:text-slate-200 transition">
            Privacy
          </a>
          <a href="#terms" className="hover:text-slate-200 transition">
            Terms
          </a>
          <a href="#contact" className="hover:text-slate-200 transition">
            Contact
          </a>
        </div>

        {/* SHORT DESCRIPTIONS */}
        <div className="text-[11px] text-slate-500 space-y-1 max-w-xl mx-auto">
          <p>
            <strong className="text-slate-300">Privacy:</strong> We keep your information secure and never share it without permission.
          </p>
          <p>
            <strong className="text-slate-300">Terms:</strong> Use of our platform indicates agreement with our user guidelines.
          </p>
          <p>
            <strong className="text-slate-300">Contact:</strong> Need help? Reach us anytime at <span className="text-slate-300">support@careernexusai.com</span>.
          </p>
        </div>

        {/* COPYRIGHT */}
        <p className="pt-2 text-slate-500">
          © {new Date().getFullYear()} <span className="font-semibold text-slate-300">CareerNexus AI</span> — All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;
