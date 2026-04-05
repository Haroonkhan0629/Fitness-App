import React, { useEffect } from 'react';

function Layout({ theme, setTheme }) {

  // Switches between light and dark mode.
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  // Keeps the page body class in sync with current theme.
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className={`App ${theme}`}>
      <label class="switch">
        <input type="checkbox"/>
          <span class="slider round" onClick={toggleTheme}></span>
      </label>
    </div>
  );
}

export default Layout;