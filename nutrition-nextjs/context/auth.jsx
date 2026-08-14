'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { registerUser, loginUser, logoutAction } from '@/app/actions';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Rehydrate profile from localStorage after mount to avoid SSR mismatch.
  // isLoggedIn is set only after loginUser completes, not here.
  useEffect(() => {
    const saved = localStorage.getItem('fit2go_profile');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('login failed:', error),
  });

  // When Google login succeeds, fetch full user details from Google.
  useEffect(() => {
    if (!user) return;
    fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${user.access_token}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.access_token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((nextProfile) => {
        setProfile(nextProfile);
        localStorage.setItem('fit2go_profile', JSON.stringify(nextProfile));
      })
      .catch(console.log);
  }, [user]);

  // On every profile load (page reload or new Google login), get fresh JWT cookies.
  useEffect(() => {
    if (!profile) return;

    const profileData = {
      name: profile.name,
      email: profile.email,
      username: profile.id,
    };

    registerUser(profileData).catch(console.log);
    loginUser(profile.id, 'random123')
      .then(() => setIsLoggedIn(true))
      .catch(console.log);
  }, [profile]);

  const logout = async () => {
    googleLogout();
    await logoutAction();
    setIsLoggedIn(false);
    setProfile(null);
    localStorage.removeItem('fit2go_profile');
  };

  return (
    <AuthContext.Provider value={{ profile, isLoggedIn, theme, setTheme, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

