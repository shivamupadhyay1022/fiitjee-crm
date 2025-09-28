import React from 'react';
import { View } from '../types';

// --- SVG Icons ---
const DashboardIcon: React.FC = () => (
  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
  </svg>
);
const StudentsIcon: React.FC = () => (
  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.273-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.273.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
  </svg>
);
const InquiriesIcon: React.FC = () => (
  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);
const PotentialsIcon: React.FC = () => (
    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
    </svg>
);
const ProgramsIcon: React.FC = () => (
  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9 5.747h18"></path><path d="M12 6.253v11.494m-9 5.747h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 6.253L3 9.75l6.75 3.497M14.25 6.253L21 9.75l-6.75 3.497"></path>
  </svg>
);
const BatchesIcon: React.FC = () => (
  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
  </svg>
);
const ResultsIcon: React.FC = () => (
  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);
const ProfileIcon: React.FC = () => (
  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const SignOutIcon: React.FC = () => (
  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);


interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSignOut: () => void;
}

const NavItem: React.FC<{
  view: View;
  activeView: View;
  setActiveView: (view: View) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ view, activeView, setActiveView, icon, label }) => {
  const isActive = activeView === view;
  const baseClasses = "flex items-center p-3 my-1 rounded-lg transition-colors duration-200 w-full";
  const activeClasses = "bg-yellow-400 text-red-800 font-bold shadow-lg dark:text-red-800";
  const inactiveClasses = "text-red-100 hover:bg-red-800 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700";

  return (
    <li>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setActiveView(view);
        }}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        {icon}
        <span className="ml-3 font-medium">{label}</span>
      </a>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, setIsOpen, onSignOut }) => {
  const navItems = [
    { view: 'dashboard' as View, label: 'Dashboard', icon: <DashboardIcon /> },
    { view: 'students' as View, label: 'Students', icon: <StudentsIcon /> },
    { view: 'inquiries' as View, label: 'Inquiries', icon: <InquiriesIcon /> },
    { view: 'potentials' as View, label: 'Potentials', icon: <PotentialsIcon /> },
    { view: 'programs' as View, label: 'Programs', icon: <ProgramsIcon /> },
    { view: 'batches' as View, label: 'Batches', icon: <BatchesIcon /> },
    { view: 'results' as View, label: 'Results', icon: <ResultsIcon /> },
  ];
  const bottomNavItems = [
     { view: 'profile' as View, label: 'Profile', icon: <ProfileIcon /> }
  ]
  
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside className={`fixed lg:relative inset-y-0 left-0 bg-red-700 text-white dark:bg-slate-900 flex flex-col p-4 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-64`}>
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <img src="https://i.ibb.co/yqg2L2W/image.png" alt="FIITJEE Logo" className="w-10 h-10 rounded-lg mr-2" />
              <h1 className="text-2xl font-extrabold tracking-tight font-orbitron text-white dark:text-yellow-400">FIITJEE</h1>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-red-200 hover:text-white dark:text-gray-400 dark:hover:text-white">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        <nav className="flex-grow">
          <ul>
            {navItems.map((item) => (
              <NavItem key={item.view} {...item} activeView={activeView} setActiveView={setActiveView} />
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
           <ul>
            {bottomNavItems.map((item) => (
              <NavItem key={item.view} {...item} activeView={activeView} setActiveView={setActiveView} />
            ))}
          </ul>
           <button
              onClick={onSignOut}
              className="flex items-center p-3 my-1 rounded-lg transition-colors duration-200 w-full text-red-100 hover:bg-red-800 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <SignOutIcon />
              <span className="ml-3 font-medium">Sign Out</span>
            </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;