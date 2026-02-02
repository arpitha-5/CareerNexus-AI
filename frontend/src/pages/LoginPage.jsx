import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  login,
  register,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
} from "../api/authApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import GoogleSignIn from "../components/common/GoogleSignIn.jsx";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [forgotMode, setForgotMode] = useState("none"); // none | email | otp
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    newPassword: "",
  });

  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ------------------ REGISTER ------------------ */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const data = await register({ ...form, role: "student" });
      if (data.message) {
        setSuccess(data.message);
        setMode("verify");
        setResendTimer(60);
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  /* ------------------ VERIFY EMAIL OTP ------------------ */
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const data = await verifyOtp({ email: form.email, otp: form.otp });
      if (data.message) {
        setSuccess(data.message);
        setTimeout(() => {
          setMode("login");
          setForm({ ...form, otp: "" });
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "Verification failed");
    }
  };

  /* ------------------ RESEND OTP ------------------ */
  const handleResendOtp = async () => {
    try {
      const data = await sendOtp(form.email);
      if (data.message) {
        setSuccess("OTP resent successfully!");
        setResendTimer(60);
      }
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    }
  };

  /* ------------------ LOGIN ------------------ */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const data = await login({ email: form.email, password: form.password });

      if (data.needsVerification) {
        setError(data.message);
        setMode("verify");
        setResendTimer(60);
        return;
      }

      if (data?.token) {
        setToken(data.token);
        setUser(data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  /* ------------------ FORGOT PASSWORD - SEND OTP ------------------ */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const data = await forgotPassword({ email: form.email });
      if (data.message) {
        setSuccess(data.message);
        setForgotMode("otp");
        setResendTimer(60);
      }
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    }
  };

  /* ------------------ RESEND FORGOT OTP ------------------ */
  const handleResendForgotOtp = async () => {
    try {
      const data = await forgotPassword({ email: form.email });
      if (data.message) {
        setSuccess("OTP resent successfully!");
        setResendTimer(60);
      }
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    }
  };

  /* ------------------ RESET PASSWORD ------------------ */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const data = await resetPassword({
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword,
      });
      if (data.message) {
        setSuccess(data.message);
        setTimeout(() => {
          setForgotMode("none");
          setMode("login");
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "Reset failed");
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 via-blue-50 to-green-50 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Soft Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-16 left-12 w-60 h-60 bg-blue-300/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-12 right-12 w-60 h-60 bg-green-300/20 blur-3xl rounded-full"></div>
      </div>

      <div className="flex w-full max-w-5xl bg-white/80 shadow-xl backdrop-blur-xl rounded-2xl overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="hidden lg:flex w-1/2 bg-white p-6 items-center justify-center">
          <div className="w-full h-full bg-linear-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg overflow-hidden flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/notes1/image/upload/WhatsApp_Image_2026-01-31_at_16.14.52_acj9w3.jpg"
              alt="CareerNexus AI - AI-Powered Career Guidance"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="w-full lg:w-1/2 p-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back 
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Sign in or create a new student account
          </p>

          {/* GOOGLE BUTTON */}
          <GoogleSignIn />

          <div className="flex items-center my-5">
            <span className="flex-1 border-t border-gray-300"></span>
            <span className="mx-3 text-gray-500 text-xs">OR</span>
            <span className="flex-1 border-t border-gray-300"></span>
          </div>

          {/* ERROR & SUCCESS */}
          {error && (
            <p className="bg-red-100 text-red-600 p-2 rounded text-xs mb-3 border border-red-300">
              {error}
            </p>
          )}

          {success && (
            <p className="bg-green-100 text-green-700 p-2 rounded text-xs mb-3 border border-green-300">
              {success}
            </p>
          )}

          {/* LOGIN / REGISTER SWITCH */}
          <div className="flex bg-gray-200 p-1 rounded-full mb-6">
            <button
              onClick={() => {
                setMode("login");
                setForgotMode("none");
              }}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                mode === "login"
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-600"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => {
                setMode("register");
                setForgotMode("none");
              }}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                mode === "register"
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-600"
              }`}
            >
              Register
            </button>
          </div>

          {/* REGISTER */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4 text-sm">
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="input-field"
              />

              <input
                name="email"
                type="email"
                placeholder="College Email"
                value={form.email}
                onChange={handleChange}
                required
                className="input-field"
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="input-field"
              />

              <button className="btn-primary">Register & Send OTP</button>
            </form>
          )}

          {/* VERIFY OTP */}
          {mode === "verify" && (
            <form onSubmit={handleVerify} className="space-y-4 text-sm">
              <p className="white">
                Enter the OTP sent to:{" "}
                <span className="font-semibold text-blue-600">
                  {form.email}
                </span>
              </p>

              <input
                name="otp"
                maxLength="6"
                placeholder="6-digit OTP"
                value={form.otp}
                onChange={handleChange}
                required
                className="input-field"
              />

              <button className="btn-primary">Verify Email</button>

              {resendTimer > 0 ? (
                <p className="text-center text-xs white">
                  Resend OTP in {resendTimer}s
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  type="button"
                  className="text-blue-600 text-xs underline"
                >
                  Resend OTP
                </button>
              )}
            </form>
          )}

          {/* LOGIN */}
          {mode === "login" && forgotMode === "none" && (
            <form onSubmit={handleLogin} className="space-y-4 text-sm">
              <input
                name="email"
                required
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
              />

              <input
                name="password"
                required
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
              />

              <div className="flex justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setForgotMode("email")}
                  className="text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>

                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-gray-500 hover:underline"
                >
                  Create account
                </button>
              </div>

              <button className="btn-primary">Login</button>
            </form>
          )}

          {/* FORGOT PASSWORD → SEND OTP */}
          {forgotMode === "email" && (
            <form
              onSubmit={handleForgotPassword}
              className="space-y-4 text-sm"
            >
              <input
                name="email"
                type="email"
                required
                placeholder="Enter registered email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
              />

              <button className="btn-primary">Send Reset OTP</button>

              <button
                type="button"
                onClick={() => setForgotMode("none")}
                className="w-full text-gray-500 text-xs hover:underline"
              >
                Back to Login
              </button>
            </form>
          )}

          {/* RESET PASSWORD */}
          {forgotMode === "otp" && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-sm">
              <input
                name="otp"
                maxLength="6"
                required
                placeholder="Enter OTP"
                value={form.otp}
                onChange={handleChange}
                className="input-field"
              />

              <input
                name="newPassword"
                required
                type="password"
                placeholder="Enter new password"
                value={form.newPassword}
                onChange={handleChange}
                className="input-field"
              />

              <button className="btn-primary">Reset Password</button>

              {resendTimer > 0 ? (
                <p className="text-center text-xs text-gray-500">
                  Resend OTP in {resendTimer}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendForgotOtp}
                  className="text-blue-600 text-xs underline"
                >
                  Resend OTP
                </button>
              )}

              <button
                type="button"
                onClick={() => setForgotMode("none")}
                className="w-full text-gray-500 text-xs hover:underline"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}