import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { me } from "../../api/authApi";

export default function AuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const [status, setStatus] = useState("Processing login...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const processLogin = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setError("No authentication token found.");
        setStatus("Login failed");
        setTimeout(() => navigate("/auth/student"), 3000);
        return;
      }

      try {
        setStatus("Verifying credentials...");

        // 1. Explicitly save to localStorage first to ensure persistence
        localStorage.setItem('lb_token', token);

        // 2. Update Context
        setToken(token);

        // 3. Fetch User Details to confirm validity
        const user = await me(token);
        setUser(user);

        setStatus("Login successful! Redirecting...");

        // 4. Redirect with slight delay to ensure state updates
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);

      } catch (err) {
        console.error("Login verification failed:", err);
        setError("Failed to verify user profile. " + (err.message || ""));
        setStatus("Login incomplete");

        // Even if fetching profile fails, if we have a token, maybe let them try accessing dashboard?
        // Or clear everything. Let's provide a manual option.
      }
    };

    processLogin();
  }, [searchParams, setToken, setUser, navigate]);

  const handleManualRetry = () => {
    window.location.reload();
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">

        {error ? (
          <>
            <div className="mx-auto w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-xl mb-4">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Login Issue</h2>
            <p className="text-slate-400 mb-6 text-sm">{error}</p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/auth/student")}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition"
              >
                Back to Login
              </button>
              <button
                onClick={handleGoToDashboard}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
              >
                Try Dashboard Anyway
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent mb-4"></div>
            <h2 className="text-lg font-semibold text-white mb-1">{status}</h2>
            <p className="text-slate-500 text-xs">Please wait while we set up your session.</p>
          </>
        )}

      </div>
    </div>
  );
}
