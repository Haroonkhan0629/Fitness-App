'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AUTH_BASE_URL, TOKEN_REFRESH_URL } from '@/constants';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('fit2go_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [theme, setTheme] = useState('light');
  // apiToken holds the short-lived JWT access token.
  const [apiToken, setApiToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('fit2go_access');
  });

  // Set up axios interceptor once on mount.
  // On 401: silently refresh the access token using the stored refresh token,
  // then retry the original request. If refresh also fails, force logout.
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const storedRefresh = localStorage.getItem('fit2go_refresh');
          if (storedRefresh) {
            try {
              const res = await axios.post(TOKEN_REFRESH_URL, { refresh: storedRefresh });
              const newAccess = res.data.access;
              localStorage.setItem('fit2go_access', newAccess);
              setApiToken(newAccess);
              axios.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
              originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
              return axios(originalRequest);
            } catch {
              // Refresh token expired — clear everything and force logout.
              localStorage.removeItem('fit2go_access');
              localStorage.removeItem('fit2go_refresh');
              localStorage.removeItem('fit2go_profile');
              delete axios.defaults.headers.common['Authorization'];
              setApiToken(null);
              setProfile(null);
            }
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('login failed:', error),
  });

  // When Google login succeeds, fetch full user details from Google.
  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${user.access_token}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.access_token}`,
            },
          }
        )
        .then((response) => {
          const nextProfile = response.data;
          setProfile(nextProfile);
          localStorage.setItem('fit2go_profile', JSON.stringify(nextProfile));
        })
        .catch((error) => console.log(error));
    }
  }, [user]);

  // Once profile is set, register the user in Django then get a JWT pair.
  useEffect(() => {
    if (profile === null) {
      setApiToken(null);
      localStorage.removeItem('fit2go_access');
      localStorage.removeItem('fit2go_refresh');
      delete axios.defaults.headers.common['Authorization'];
    } else {
      // Clear any previous tokens before issuing a fresh login.
      setApiToken(null);
      localStorage.removeItem('fit2go_access');
      localStorage.removeItem('fit2go_refresh');
      delete axios.defaults.headers.common['Authorization'];

      const profileData = {
        name: profile.name,
        email: profile.email,
        username: profile.id,
      };

      axios.post(`${AUTH_BASE_URL}register/`, profileData).catch((error) => console.log(error));

      // POST to JWT TokenObtainPairView — returns { access, refresh }.
      axios
        .post(`${AUTH_BASE_URL}login/`, { username: profile.id, password: 'random123' })
        .then((response) => {
          const { access, refresh } = response.data;
          if (access) {
            setApiToken(access);
            localStorage.setItem('fit2go_access', access);
            localStorage.setItem('fit2go_refresh', refresh);
          }
        })
        .catch((error) => {
          console.log(error);
          setApiToken(null);
          localStorage.removeItem('fit2go_access');
          localStorage.removeItem('fit2go_refresh');
          delete axios.defaults.headers.common['Authorization'];
        });
    }
  }, [profile]);

  // Keep axios default Authorization header in sync with the access token.
  useEffect(() => {
    if (apiToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [apiToken]);

  const logout = () => {
    googleLogout();
    delete axios.defaults.headers.common['Authorization'];
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

