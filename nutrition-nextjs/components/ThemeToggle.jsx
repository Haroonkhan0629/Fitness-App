'use client';

import { useEffect } from 'react';

export default function ThemeToggle({ theme, setTheme }) {
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className={`App ${theme}`}>
      <label className="switch">
        <input type="checkbox" readOnly checked={theme === 'dark'} />
        <span className="slider round" onClick={toggleTheme} />
      </label>
    </div>
  );
}
