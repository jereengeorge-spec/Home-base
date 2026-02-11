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
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative animate-fade-in" role="alert">
              <strong className="font-bold">Ticket Submitted! </strong>
              <span className="block sm:inline">Your tracking ID is <span className="font-mono font-bold">{successId}</span>. Please keep this for your records.</span>
              <button onClick={() => setSuccessId(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 0 0 1 0 1.698z"/></svg>
              </button>
            </div>
          </div>
        )}

        {view === 'customer' && <TicketForm onSuccess={handleSuccess} />}
        {view === 'admin' && <AdminDashboard />}
        {view === 'status' && <TicketStatusPage />}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Jereen George. Built for high-efficiency.
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-xs uppercase tracking-widest font-bold">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-xs uppercase tracking-widest font-bold">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-xs uppercase tracking-widest font-bold">Deploy to GCP</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;