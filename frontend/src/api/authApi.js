// src/api/authApi.js

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/auth`;

export async function register(payload) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
}

export async function sendOtp(payload) {
  const res = await fetch(`${API}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      typeof payload === "string" ? { email: payload } : payload
    ),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to send OTP");
  return data;
}

export async function verifyOtp(payload) {
  const res = await fetch(`${API}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Verification failed");
  return data;
}

export async function login(payload) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok && res.status !== 403) throw new Error(data.message || "Login failed");
  return data;
}

export async function me(token) {
  return fetch(`${API}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  }).then((r) => {
    if (!r.ok) throw new Error('Failed to fetch user');
    return r.json();
  });
}

/* --------------------------------------------
   📌 FORGOT PASSWORD & RESET FUNCTIONS
--------------------------------------------- */

export async function forgotPassword(payload) {
  const res = await fetch(`${API}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to send OTP");
  return data;
}

export async function resetPassword(payload) {
  const res = await fetch(`${API}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to reset password");
  return data;
}
