import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { TicketForm } from './components/TicketForm';
import { AdminDashboard } from './components/AdminDashboard';
import { TicketStatusPage } from './components/TicketStatus';

const App: React.FC = () => {
  const [view, setView] = useState<'customer' | 'admin' | 'status'>('customer');
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleSuccess = (id: string) => {
    setSuccessId(id);
    setView('status');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar view={view} setView={setView} />

      <main className="flex-grow">
        {successId && view === 'status' && (
          <div className="max-w-2xl mx-auto mt-8 px-4">
            <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 px-5 py-4 rounded-xl relative animate-fade-in flex items-start space-x-3" role="alert">
              <svg className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold">George has it.</p>
                <p className="text-sm mt-0.5">Your request ID is <span className="font-mono font-bold">{successId}</span>. Save this to check back anytime.</p>
              </div>
              <button onClick={() => setSuccessId(null)} className="absolute top-3 right-3 text-indigo-400 hover:text-indigo-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </div>
        )}

        {view === 'customer' && <TicketForm onSuccess={handleSuccess} />}
        {view === 'admin' && <AdminDashboard />}
        {view === 'status' && <TicketStatusPage />}
      </main>

      <footer className="bg-white border-t border-gray-200 py-10 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <div className="bg-indigo-600 p-1.5 rounded-md">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">TechButler</span>
          </div>
          <p className="text-gray-400 text-sm font-medium">Be their family. Let George be their tech support.</p>
          <p className="text-gray-400 text-xs mt-1">$99/month &middot; 24/7 &middot; No hold music &middot; No condescension</p>
          <div className="mt-5 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-xs uppercase tracking-widest font-semibold">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-xs uppercase tracking-widest font-semibold">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-xs uppercase tracking-widest font-semibold">Contact</a>
          </div>
          <p className="text-gray-300 text-xs mt-5">&copy; {new Date().getFullYear()} TechButler. Built by Jereen George.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
