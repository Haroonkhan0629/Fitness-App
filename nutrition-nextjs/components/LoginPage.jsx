'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/auth';
import UserPage from './UserPage';

export default function LoginPage() {
  const { profile, loginWithGoogle, logout, theme } = useAuth();
  const hasGoogleClientId = Boolean((process.env.NEXT_PUBLIC_CLIENT_ID || '').trim());

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
      <GoogleLogin
        onSuccess={loginWithGoogle}
        onError={() => console.error('Google login failed')}
        theme="filled_blue"
        size="large"
        text="signin_with"
      />
    </div>
  );
}
