'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import { isAccessTokenValid, refreshAccessToken } from '@/lib/api';

const AuthContext = createContext(null);
// Auth calls go directly from the browser so Render cold-start never hits a Netlify timeout.
const AUTH_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/api/auth/`;

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState('light');
  const [apiToken, setApiToken] = useState(null);

  // Reuse an unexpired access token; refresh only when it is missing or expired.
  useEffect(() => {
    const handleSessionExpired = () => {
      setApiToken(null);
      setProfile(null);
    };
    const handleTokenRefreshed = (event) => setApiToken(event.detail.access);
    window.addEventListener('fit2go:session-expired', handleSessionExpired);
    window.addEventListener('fit2go:token-refreshed', handleTokenRefreshed);

    const access = localStorage.getItem('fit2go_access');
    const refresh = localStorage.getItem('fit2go_refresh');
    const accessIsValid = access && isAccessTokenValid(access);
    const savedProfile = localStorage.getItem('fit2go_profile');

    if (accessIsValid) setApiToken(access);
    if (savedProfile && (accessIsValid || refresh)) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Saved profile is invalid:', error);
        localStorage.removeItem('fit2go_profile');
      }
    } else if (!accessIsValid && !refresh) {
      localStorage.removeItem('fit2go_profile');
    }

    if (refresh && !accessIsValid) {
      refreshAccessToken().catch((error) => console.error('Token refresh failed:', error));
    }

    return () => {
      window.removeEventListener('fit2go:session-expired', handleSessionExpired);
      window.removeEventListener('fit2go:token-refreshed', handleTokenRefreshed);
    };
  }, []);

  const loginWithGoogle = async (googleResponse) => {
    try {
      const response = await fetch(`${AUTH_URL}google/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: googleResponse.credential }),
      });
      const data = await response.json();
      if (!response.ok || !data.access || !data.refresh || !data.profile) {
        throw new Error(data.detail || `Google sign-in failed (${response.status})`);
      }

      setProfile(data.profile);
      setApiToken(data.access);
      localStorage.setItem('fit2go_profile', JSON.stringify(data.profile));
      localStorage.setItem('fit2go_access', data.access);
      localStorage.setItem('fit2go_refresh', data.refresh);
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  const logout = async () => {
    const refresh = localStorage.getItem('fit2go_refresh');
    googleLogout();
    setProfile(null);
    setApiToken(null);
    localStorage.removeItem('fit2go_profile');
    localStorage.removeItem('fit2go_access');
    localStorage.removeItem('fit2go_refresh');

    if (!refresh) return;
    try {
      const response = await fetch(`${AUTH_URL}logout/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (!response.ok) {
        throw new Error(`Token revocation failed (${response.status})`);
      }
    } catch (error) {
      console.error('Logout token revocation failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ profile, apiToken, theme, setTheme, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
