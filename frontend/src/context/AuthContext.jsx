import React, { createContext, useContext, useEffect, useState } from 'react';
import { me } from '../api/authApi.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'lb_token';

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await me(token);
        setUser(data);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setTokenState(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const setToken = (val) => {
    if (val) localStorage.setItem(TOKEN_KEY, val);
    else localStorage.removeItem(TOKEN_KEY);
    setTokenState(val);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const data = await me(token);
      setUser(data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, setToken, setUser, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);