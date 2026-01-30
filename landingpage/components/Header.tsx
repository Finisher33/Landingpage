
import React from 'react';
import { APP_NAME } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">X</div>
            <span className="text-xl font-bold tracking-tight text-white uppercase italic">
              {APP_NAME}
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <span className="text-sm font-medium text-slate-400">지정학 & 기술 웨비나</span>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
