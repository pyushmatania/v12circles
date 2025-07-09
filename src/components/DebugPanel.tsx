import React, { useState, useEffect } from 'react';

// You can import useAuth and other hooks as needed
import { useAuth } from './auth/useAuth';
import { projects } from '../data/projects';

const DebugPanel: React.FC<{ currentView?: string }> = ({ currentView }) => {
  const [visible, setVisible] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    // Listen for global errors
    const handler = (event: ErrorEvent) => {
      setErrors((prev) => [...prev, event.message]);
    };
    window.addEventListener('error', handler);
    return () => window.removeEventListener('error', handler);
  }, []);

  // Keyboard shortcut: Ctrl+D to toggle
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'd') {
        setVisible((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (import.meta.env.MODE === 'production') return null;

  return (
    <>
      <button
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 10000,
          background: '#6366f1',
          color: 'white',
          borderRadius: '50%',
          width: 40,
          height: 40,
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
        }}
        onClick={() => setVisible((v) => !v)}
        title="Toggle Debug Panel (Ctrl+D)"
      >
        D
      </button>
      {visible && (
        <div
          style={{
            position: 'fixed',
            bottom: 70,
            right: 20,
            zIndex: 10000,
            background: 'rgba(30,41,59,0.98)',
            color: 'white',
            borderRadius: 12,
            padding: 20,
            minWidth: 320,
            maxWidth: 400,
            boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
            fontSize: 14,
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Debug Panel</div>
          <div><b>Current View:</b> {currentView}</div>
          <div><b>Authenticated:</b> {isAuthenticated ? 'Yes' : 'No'}</div>
          <div><b>User:</b> {user ? user.email || user.id : 'None'}</div>
          <div><b>Projects Loaded:</b> {projects.length}</div>
          <div><b>Time:</b> {new Date().toLocaleTimeString()}</div>
          {errors.length > 0 && (
            <div style={{ marginTop: 12, color: '#f87171' }}>
              <b>Errors:</b>
              <ul>
                {errors.slice(-5).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
          <div style={{ marginTop: 12, fontSize: 12, color: '#a3a3a3' }}>
            (Visible only in development. Toggle with Ctrl+D)
          </div>
        </div>
      )}
    </>
  );
};

export default DebugPanel; 