'use client';

import { useAuth } from '@/context/auth';
import UserPage from './UserPage';

export default function LoginPage() {
  const { profile, login, logout, theme, loginStatus } = useAuth();
  const hasGoogleClientId = Boolean((process.env.NEXT_PUBLIC_CLIENT_ID || '').trim());

  if (profile) {
    return (
      <div>
        <p style={{ fontSize: '0.7rem', opacity: 0.5 }}>auth: {loginStatus}</p>
        <UserPage profile={profile} logout={logout} theme={theme} />
      </div>
    );
  }

  return (
    <div className="login-container">
      {!hasGoogleClientId && (
        <p>Please set NEXT_PUBLIC_CLIENT_ID in .env.local, then restart the dev server.</p>
      )}
      <button className="login-button" onClick={login}>
        Sign in with Google
      </button>
    </div>
  );
}
