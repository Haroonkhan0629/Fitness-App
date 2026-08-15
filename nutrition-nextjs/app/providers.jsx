'use client';

import { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/context/auth';

export default function Providers({ children }) {
  const googleClientId = (process.env.NEXT_PUBLIC_CLIENT_ID || '').trim();

  // Warm up Render on mount and keep it alive every 10 min (free tier spins down after 15 min).
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!url) return;
    fetch(`${url}/api/main_app/`).catch(() => {});
    const interval = setInterval(() => fetch(`${url}/api/main_app/`).catch(() => {}), 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleClientId || 'missing-client-id.apps.googleusercontent.com'}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
}
