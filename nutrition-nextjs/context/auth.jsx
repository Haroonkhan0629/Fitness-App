'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

const AuthContext = createContext(null);
// Auth calls go directly from the browser so Render cold-start never hits a Netlify timeout.
const AUTH_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/api/auth/`;

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState('light');
  const [apiToken, setApiToken] = useState(null);

  // Rehydrate from localStorage and silently refresh the access token on mount.
  useEffect(() => {
    const saved = localStorage.getItem('fit2go_profile');
    if (saved) setProfile(JSON.parse(saved));
    const access = localStorage.getItem('fit2go_access');
    const refresh = localStorage.getItem('fit2go_refresh');
    if (access) setApiToken(access);
    if (refresh) {
      fetch(`${AUTH_URL}token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.access) {
            setApiToken(data.access);
            localStorage.setItem('fit2go_access', data.access);
          }
        })
        .catch(() => {});
    }
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
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.access_token}` } }
    )
      .then((res) => res.json())
      .then((nextProfile) => {
        setProfile(nextProfile);
        localStorage.setItem('fit2go_profile', JSON.stringify(nextProfile));
      })
      .catch(console.log);
  }, [user]);

  // On new Google login, register then login sequentially to avoid race condition on new accounts.
  useEffect(() => {
    if (!profile || !user) return;
    const profileData = { name: profile.name, email: profile.email, username: profile.id };
    const doAuth = async () => {
      await fetch(`${AUTH_URL}register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      }).catch(console.log);
      fetch(`${AUTH_URL}login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: profile.id, password: 'random123' }),
      })
        .then((res) => res.json())
        .then(({ access, refresh }) => {
          if (access) {
            setApiToken(access);
            localStorage.setItem('fit2go_access', access);
            localStorage.setItem('fit2go_refresh', refresh);
          }
        })
        .catch(console.log);
    };
    doAuth();
  }, [profile]);

  const logout = () => {
    googleLogout();
    setProfile(null);
    setApiToken(null);
    localStorage.removeItem('fit2go_profile');
    localStorage.removeItem('fit2go_access');
    localStorage.removeItem('fit2go_refresh');
  };

  return (
    <AuthContext.Provider value={{ profile, apiToken, theme, setTheme, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

const AuthContext = createContext(null);
// Auth calls go directly from the browser so Render cold-start never hits a Netlify timeout.
const AUTH_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/api/auth/`;

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState('light');
  const [apiToken, setApiToken] = useState(null);

  // Rehydrate from localStorage after mount to avoid SSR mismatch.
  useEffect(() => {
    const saved = localStorage.getItem('fit2go_profile');
    if (saved) setProfile(JSON.parse(saved));
    const token = localStorage.getItem('fit2go_access');
    if (token) setApiToken(token);
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
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.access_token}` } }
    )
      .then((res) => res.json())
      .then((nextProfile) => {
        setProfile(nextProfile);
        localStorage.setItem('fit2go_profile', JSON.stringify(nextProfile));
      })
      .catch(console.log);
  }, [user]);

  // On new Google login, register then login sequentially to avoid race condition.
  useEffect(() => {
    if (!profile || !user) return;
    const profileData = { name: profile.name, email: profile.email, username: profile.id };
    const doAuth = async () => {
      await fetch(`${AUTH_URL}register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      }).catch(console.log);
      fetch(`${AUTH_URL}login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: profile.id, password: 'random123' }),
      })
        .then((res) => res.json())
        .then(({ access, refresh }) => {
          if (access) {
            setApiToken(access);
            localStorage.setItem('fit2go_access', access);
            localStorage.setItem('fit2go_refresh', refresh);
          }
        })
        .catch(console.log);
    };
    doAuth();
  }, [profile]);

  const logout = () => {
    googleLogout();
    setProfile(null);
    setApiToken(null);
    localStorage.removeItem('fit2go_profile');
    localStorage.removeItem('fit2go_access');
    localStorage.removeItem('fit2go_refresh');
  };

  return (
    <AuthContext.Provider value={{ profile, apiToken, theme, setTheme, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState('light');
  const [apiToken, setApiToken] = useState(null);

  // Rehydrate from localStorage after mount to avoid SSR mismatch.
  useEffect(() => {
    const saved = localStorage.getItem('fit2go_profile');
    if (saved) setProfile(JSON.parse(saved));
    const token = localStorage.getItem('fit2go_access');
    if (token) setApiToken(token);
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
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.access_token}` } }
    )
      .then((res) => res.json())
      .then((nextProfile) => {
        setProfile(nextProfile);
        localStorage.setItem('fit2go_profile', JSON.stringify(nextProfile));
      })
      .catch(console.log);
  }, [user]);

  // On new Google login (user set), register with Django and store JWT in localStorage.
  useEffect(() => {
    if (!profile || !user) return;
    const profileData = { name: profile.name, email: profile.email, username: profile.id };
    registerUser(profileData).catch(console.log);
    loginUser(profile.id, 'random123')
      .then(({ access, refresh }) => {
        setApiToken(access);
        localStorage.setItem('fit2go_access', access);
        localStorage.setItem('fit2go_refresh', refresh);
      })
      .catch(console.log);
  }, [profile]);

  const logout = () => {
    googleLogout();
    setProfile(null);
    setApiToken(null);
    localStorage.removeItem('fit2go_profile');
    localStorage.removeItem('fit2go_access');
    localStorage.removeItem('fit2go_refresh');
  };

  return (
    <AuthContext.Provider value={{ profile, apiToken, theme, setTheme, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

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

    // Retry up to 2 times to handle Render cold-start delays.
    const attemptLogin = (retriesLeft) => {
      loginUser(profile.id, 'random123')
        .then(() => { setIsLoggedIn(true); localStorage.setItem('fit2go_has_session', '1'); })
        .catch((err) => {
          if (retriesLeft > 0) setTimeout(() => attemptLogin(retriesLeft - 1), 8000);
          else console.log('Login failed after retries:', err);
        });
    };
    attemptLogin(2);
  }, [profile]);

  const logout = async () => {
    googleLogout();
    await logoutAction();
    setIsLoggedIn(false);
    setProfile(null);
    localStorage.removeItem('fit2go_profile');
    localStorage.removeItem('fit2go_has_session');
  };

  return (
    <AuthContext.Provider value={{ profile, isLoggedIn, theme, setTheme, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

