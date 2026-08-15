'use client';

import { useAuth } from '@/context/auth';
import UserPage from './UserPage';

export default function LoginPage() {
  const { profile, login, logout, theme } = useAuth();
  const hasGoogleClientId = Boolean((process.env.NEXT_PUBLIC_CLIENT_ID || '').trim());

  const handleLogin = () => {
    // Pre-warm Render during the OAuth flow so it's ready when doAuth fires.
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (url) fetch(`${url}/api/main_app/`).catch(() => {});
    login();
  };

  if (profile) {
    return (
      <div>
        <UserPage profile={profile} logout={logout} theme={theme} />
      </div>
    );
  }

  return (
    <div className="login-container">
      {!hasGoogleClientId && (
        <p>Please set NEXT_PUBLIC_CLIENT_ID in .env.local, then restart the dev server.</p>
      )}
      <button className="login-button" onClick={handleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}
