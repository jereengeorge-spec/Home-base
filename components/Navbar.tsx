
import React from 'react';

interface NavbarProps {
  view: 'customer' | 'admin' | 'status';
  setView: (view: 'customer' | 'admin' | 'status') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ view, setView }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => setView('customer')}
            >
              <div className="bg-indigo-600 p-2 rounded-lg mr-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">TechButler</span>
                <span className="hidden sm:block text-xs text-gray-400 leading-none">Be their family. Let George handle the rest.</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setView('customer')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'customer' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Get Help
            </button>
            <button
              onClick={() => setView('status')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'status' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Track My Request
            </button>
            <button
              onClick={() => setView('admin')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'admin' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
