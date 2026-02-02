import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import ThemeSwitcher from './ThemeSwitcher.jsx';

const Navbar = ({ showProfileIcon = true, showNavLinks = true }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const goDashboard = () => {
    navigate('/dashboard');
  };

  const goProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get full photo URL with backend server
  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) return null;
    // If it's already a full URL, return as is
    if (photoUrl.startsWith('http')) return photoUrl;
    // Otherwise, prepend backend URL
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
    return `${backendUrl}${photoUrl}`;
  };

  const photoUrl = getPhotoUrl(user?.profile?.photoUrl);

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 border-b backdrop-blur" style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 23, 42, 0.95)' }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2">
  <img
    src="https://res.cloudinary.com/notes1/image/upload/ChatGPT_Image_Jan_31_2026_04_06_05_PM_p4mxds.png"
    alt="CareerNexus AI Logo"
    className="h-8 w-38 rounded-lg object-cover"
  />

  <span className="text-sm font-semibold tracking-widest text-white">
    <span className="text-indigo-400"></span>
  </span>
</Link>

        
        <div className="flex items-center gap-3 text-xs">
          {showNavLinks && (
            <>
              <Link to="/features" className="text-slate-200 hover:text-white transition">
                Features
              </Link>
              <Link to="/community-info" className="text-slate-200 hover:text-white transition">
                Community
              </Link>
              <Link to="/careers" className="text-slate-200 hover:text-white transition">
                Careers
              </Link>
            </>
          )}
          
          {user ? (
            <>
              <button
                onClick={goDashboard}
                className="rounded-full bg-indigo-500 px-3 py-1.5 font-semibold text-white hover:bg-indigo-400"
              >
                Dashboard
              </button>
              <ThemeSwitcher />
              {showProfileIcon && (
                <button
                  onClick={goProfile}
                  className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all duration-200 shadow-lg hover:shadow-xl bg-slate-700"
                  title="Profile"
                >
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.parentElement?.querySelector('svg')) {
                          e.target.parentElement.querySelector('svg').style.display = 'block';
                        }
                      }}
                    />
                  ) : null}
                  <svg
                    className="w-4 h-4 text-white"
                    style={{ display: photoUrl ? 'none' : 'block' }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-600 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth/student"
              className="rounded-full bg-indigo-500 px-3 py-1.5 font-semibold text-white hover:bg-indigo-400"
            >
              Join Now
            </Link>

          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;