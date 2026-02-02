import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import { login, register, sendOtp, verifyOtp } from '../../api/authApi.js';
import { useAuth } from '../../context/AuthContext.jsx';

const FacultyAuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'verify'
  const [form, setForm] = useState({ name: '', email: '', password: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    await register({ ...form, role: 'faculty' });
    await sendOtp(form.email);
    setMode('verify');
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    await verifyOtp({ email: form.email, otp: form.otp });
    setMode('login');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const data = await login({ email: form.email, password: form.password });
      console.log('Login response:', data);
      setToken(data.token);
      setUser(data.user);
      setSuccess('✅ Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard/faculty'), 1000);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async () => {
    setForm({ ...form, email: 'faculty@learnbridge.com', password: 'faculty123' });
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const data = await login({ email: 'faculty@learnbridge.com', password: 'faculty123' });
      console.log('Login response:', data);
      setToken(data.token);
      setUser(data.user);
      setSuccess('✅ Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard/faculty'), 1000);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 pt-24">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <h1 className="mb-1 text-xl font-bold text-slate-50">Faculty / Mentor Access</h1>
          <p className="mb-4 text-xs text-slate-400">
            Log in to create courses, assign learning plans, and monitor student progress with AI insights.
          </p>
          
          {/* Default Credentials Hint */}
          <div className="mb-4 rounded-lg bg-blue-500/10 border border-blue-500/30 p-3 text-xs">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-blue-300">🔑 Default Faculty Login:</p>
              <button
                onClick={quickLogin}
                disabled={loading}
                className="px-3 py-1 bg-green-500 hover:bg-green-400 text-white font-semibold rounded disabled:opacity-50"
              >
                ⚡ Quick Login
              </button>
            </div>
            <p className="text-blue-200">Email: faculty@learnbridge.com</p>
            <p className="text-blue-200">Password: faculty123</p>
          </div>
          
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-300">
              ❌ {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-xs text-green-300">
              {success}
            </div>
          )}

          <div className="mb-4 flex gap-2 text-xs">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 rounded-full px-3 py-1.5 ${
                mode === 'login' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 rounded-full px-3 py-1.5 ${
                mode === 'register' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Register
            </button>
          </div>

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-md bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-indigo-500"
              />
              <input
                name="email"
                type="email"
                placeholder="Official Email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-md bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-indigo-500"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-md bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="mt-1 w-full rounded-md bg-indigo-500 py-2 font-semibold text-white hover:bg-indigo-400"
              >
                Register &amp; Send OTP
              </button>
            </form>
          )}

          {mode === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-3 text-xs">
              <p className="text-slate-300">
                Enter the 6-digit OTP sent to <span className="font-semibold">{form.email}</span>
              </p>
              <input
                name="otp"
                placeholder="OTP"
                value={form.otp}
                onChange={handleChange}
                className="w-full rounded-md bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="w-full rounded-md bg-emerald-500 py-2 font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Verify Email
              </button>
            </form>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3 text-xs">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-md bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-indigo-500"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-md bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-md bg-indigo-500 py-2 font-semibold text-white hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyAuthPage;