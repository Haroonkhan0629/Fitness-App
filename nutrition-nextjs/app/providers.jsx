'use client';

import { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/context/auth';

export default function Providers({ children }) {
  const googleClientId = (process.env.NEXT_PUBLIC_CLIENT_ID || '').trim();

  // Wake up the Render backend (free tier spins down after inactivity).
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (url) fetch(`${url}/api/main_app/`).catch(() => {});
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleClientId || 'missing-client-id.apps.googleusercontent.com'}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
}
