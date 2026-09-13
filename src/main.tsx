import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatContainer from './components/chat/ChatContainer';
import './app/globals.css';

// Ensure dark mode default
if (typeof document !== 'undefined') {
  const saved = localStorage.getItem('aura_theme');
  if (saved === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
}

const mountNode = document.getElementById('root') || document.getElementById('__next');

if (mountNode) {
  // Remove pre-hydration loader cleanly
  const loader = document.getElementById('app-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
    }, 200);
  }

  const root = ReactDOM.createRoot(mountNode);
  root.render(
    <React.StrictMode>
      <ChatContainer />
    </React.StrictMode>
  );
} else {
  console.error('Failed to find root mount element (#root or #__next)');
}
