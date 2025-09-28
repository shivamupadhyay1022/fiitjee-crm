import React, { useState, useEffect, useRef } from 'react';

interface Action {
  label: string;
  onClick: () => void;
  className?: string;
}

interface ActionsDropdownProps {
  actions: Action[];
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center p-2 rounded-full text-sm font-medium text-slate-500 bg-transparent hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            {actions.map((action, index) => (
              <a
                key={index}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  action.onClick();
                  setIsOpen(false);
                }}
                className={`block px-4 py-2 text-sm ${action.className || 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
                role="menuitem"
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionsDropdown;
