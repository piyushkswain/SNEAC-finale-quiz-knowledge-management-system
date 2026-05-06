import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check current theme on mount
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Configure your Knowledge Management System preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Appearance</h2>
          
          <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Theme Mode</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>Toggle between Light and Dark interface.</p>
            </div>
            <button 
              onClick={toggleTheme}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.5rem 1rem', 
                borderRadius: '8px', 
                border: '1px solid var(--border)', 
                background: isDarkMode ? 'var(--primary)' : 'var(--surface)', 
                color: isDarkMode ? 'white' : 'var(--text-main)',
                cursor: 'pointer', 
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
