import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { View } from '../types';
import { useTheme } from './ThemeContext';

// --- Icons ---
const SunIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
  </svg>
);
const MoonIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
  </svg>
);


interface HeaderProps {
  view: View;
  onMenuClick: () => void;
  user: User;
  onSignOut: () => void;
  setActiveView: (view: View) => void;
}

const UserDropdown: React.FC<{ user: User; onSignOut: () => void; onProfileClick: () => void; }> = ({ user, onSignOut, onProfileClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        <img src={user.photoURL || "https://picsum.photos/100"} alt="User Avatar" className="w-10 h-10 rounded-full" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
          <div className="py-1">
            <div className="px-4 py-2 border-b dark:border-slate-600">
              <p className="text-sm text-gray-700 dark:text-gray-300">Signed in as</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); onProfileClick(); setIsOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600">Your Profile</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onSignOut(); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600">Sign out</a>
          </div>
        </div>
      )}
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ view, onMenuClick, user, onSignOut, setActiveView }) => {
  const title = view.charAt(0).toUpperCase() + view.slice(1);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-yellow-400 dark:bg-slate-900 shadow-sm p-4 border-b border-yellow-500 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="lg:hidden text-red-700 dark:text-yellow-400 hover:text-red-900 dark:hover:text-yellow-200 mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <h2 className="text-2xl font-bold text-red-700 dark:text-yellow-400">{title}</h2>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="relative hidden sm:block">
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 border border-red-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-yellow-400 transition-all w-40 focus:w-64 bg-white dark:bg-slate-700 dark:text-white" 
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-full text-red-700 dark:text-yellow-400 hover:bg-yellow-500 dark:hover:bg-slate-700">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
        <button className="p-2 rounded-full text-red-700 dark:text-yellow-400 hover:bg-yellow-500 dark:hover:bg-slate-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </button>
        <UserDropdown user={user} onSignOut={onSignOut} onProfileClick={() => setActiveView('profile')} />
      </div>
    </header>
  );
};

export default Header;