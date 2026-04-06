import React from "react";
import UserPage from "./UserPage";

function LoginPage({ profile, login, logout, theme }) {
  const hasGoogleClientId = Boolean((process.env.REACT_APP_CLIENT_ID || '').trim());

  // If signed in, show user information; otherwise show Google sign-in button.
    return (
        <div>
        {profile ? (
          <div>
            <UserPage profile={profile} logout={logout} theme={theme}/>
          </div>
        ) : (
            <div className="login-container">
              {!hasGoogleClientId && (
                <p>Please set REACT_APP_CLIENT_ID in .env.local, then restart the frontend server.</p>
              )}
              <button className="login-button" onClick={login}>
                Sign in with Google
              </button>
            </div>
        )}
      </div>
    )
}

export default LoginPage