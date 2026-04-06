import './App.css';
import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { Routes, Route } from "react-router-dom";
import Navigation from './components/Navigation';
import Search from './components/Search';
import Home from './components/Home';
import HomeFolders from './components/HomeFolders';
import Settings from './components/Settings';
import LoginPage from './components/LoginPage';
import Bookmarks from './components/Bookmarks';
import axios from 'axios';
import { AUTH_BASE_URL } from './constants';


const App = () => {
  // Keeps temporary Google login response details.
  const [user, setUser] = useState(null);
  // Stores the signed-in user's profile used across the app.
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('fit2go_profile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });
  // Controls light or dark color mode.
  const [theme, setTheme] = useState('light');

  // Starts Google sign-in and saves the returned access data.
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('login failed:', error)
  });

  // When Google login succeeds, fetch full user details from Google.
  useEffect(() => {
    if (user) {
      console.log(user)
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${user['access_token']}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user['access_token']}`,
          }
        })
        .then(
          (response) => {
            console.log('changes');
            const nextProfile = response['data'];
            setProfile(nextProfile);
            localStorage.setItem('fit2go_profile', JSON.stringify(nextProfile));
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }, [user]);

  // Once profile is available, register or update this user in Django backend.
  useEffect(() => {
    if (profile === null) {
      console.log('profile null');
    } else {
      console.log('sending data to django');

      const profileData = {
        name: profile['name'],
        email: profile['email'],
        username: profile['id']
      };

      console.log(profileData);

      axios.post(`${AUTH_BASE_URL}register/`, profileData).then(
        (response) => {
          console.log(response['data']);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, [profile]);

  // Signs out from Google and clears local profile data.
  const logout = () => {
    googleLogout();
    setProfile(null);
    localStorage.removeItem('fit2go_profile');
  };

  if (profile) {
    console.log('profile present');
    console.log(profile);
  }

  return (
    <div>
      <Navigation profile={profile} />
      <Routes>
        <Route path="/login" element={<LoginPage profile={profile} logout={logout} login={login} theme={theme}/>} />
        <Route path="/settings" element={<Settings profile={profile} theme={theme} setTheme={setTheme}/>} />
        <Route path="/home" element={<Home profile={profile} theme={theme}/>} />
        <Route path="/" element={<HomeFolders theme={theme}/>} />
        <Route path="/search" element={<Search profile={profile} theme={theme}/>} />
        <Route path="/bookmarks" element={<Bookmarks profile={profile} theme={theme} />} />
      </Routes>
    </div>
  );
}

export default App;

