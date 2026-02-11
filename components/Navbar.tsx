
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Jereen George</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setView('customer')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'customer' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Submit Ticket
            </button>
            <button
              onClick={() => setView('status')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'status' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Track Status
            </button>
            <button
              onClick={() => setView('admin')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'admin' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
