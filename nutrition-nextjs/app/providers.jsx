'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/context/auth';

export default function Providers({ children }) {
  const googleClientId = (process.env.NEXT_PUBLIC_CLIENT_ID || '').trim();
  return (
    <GoogleOAuthProvider clientId={googleClientId || 'missing-client-id.apps.googleusercontent.com'}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
}
