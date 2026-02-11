
import React, { useState } from 'react';
import { getTicketById } from '../services/ticketService';
import { Ticket, TicketStatus } from '../types';

export const TicketStatusPage: React.FC = () => {
  const [ticketId, setTicketId] = useState('');
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId.trim()) return;
    setLoading(true);
    setError('');
    const result = await getTicketById(ticketId.trim().toUpperCase());
    if (result) {
      setTicket(result);
    } else {
      setTicket(null);
      setError('Ticket not found. Please verify the ID.');
    }
    setLoading(false);
  };

  const getStatusDisplay = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN: return { label: 'Received & Queued', color: 'text-blue-600 bg-blue-50', dot: 'bg-blue-400' };
      case TicketStatus.IN_PROGRESS: return { label: 'Engineer Reviewing', color: 'text-amber-600 bg-amber-50', dot: 'bg-amber-400' };
      case TicketStatus.RESOLVED: return { label: 'Issue Resolved', color: 'text-emerald-600 bg-emerald-50', dot: 'bg-emerald-400' };
      default: return { label: 'Closed', color: 'text-gray-600 bg-gray-50', dot: 'bg-gray-400' };
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-8 border-b border-gray-100 bg-indigo-50/50">
          <h2 className="text-2xl font-bold text-gray-900">Track your request</h2>
          <p className="mt-2 text-sm text-gray-600">Enter your ticket ID (e.g., TIC-XXXXX) to see real-time progress.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="Enter Ticket ID"
              className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border uppercase font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {loading ? '...' : 'Track'}
            </button>
          </form>

          {error && <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>}

          {ticket && (
            <div className="mt-8 animate-fade-in">
              <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{ticket.subject}</h3>
                    <p className="text-xs text-gray-400 font-mono">ID: {ticket.id}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusDisplay(ticket.status).color}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${getStatusDisplay(ticket.status).dot}`}></span>
                    {getStatusDisplay(ticket.status).label}
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Progress Line */}
                  <div className="relative">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                      <div 
                        style={{ width: ticket.status === TicketStatus.OPEN ? '25%' : ticket.status === TicketStatus.IN_PROGRESS ? '65%' : '100%' }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${ticket.status === TicketStatus.RESOLVED ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-gray-400">
                      <span>Submitted</span>
                      <span>Review</span>
                      <span>Resolved</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Request Details</h4>
                    <p className="text-sm text-gray-700 italic">"{ticket.description}"</p>
                  </div>

                  {ticket.status === TicketStatus.RESOLVED && (
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <h4 className="text-sm font-bold text-emerald-900 mb-1">Success!</h4>
                      <p className="text-sm text-emerald-800">Your issue has been resolved. If you need further assistance, please open a new ticket.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
