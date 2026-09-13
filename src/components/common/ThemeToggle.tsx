'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('aura_theme');
    if (saved === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aura_theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aura_theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
      className="p-2 rounded-xl transition-all duration-200 text-zinc-400 hover:text-zinc-100 hover:bg-white/10 dark:hover:bg-zinc-800/80 active:scale-95"
      aria-label="Toggle Theme"
    >
      {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
    </button>
  );
}
