
import React from 'react';
import { PillIcon } from './Icons';

interface HeaderProps {
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={onReset} className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
            <PillIcon className="h-8 w-8 text-sky-500" />
            <span>Pill Pal AI</span>
          </button>
          {/* Future navigation items can go here */}
        </div>
      </div>
    </header>
  );
};
