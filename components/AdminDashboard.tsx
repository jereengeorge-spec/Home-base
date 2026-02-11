
import React, { useEffect, useState } from 'react';
import { getTickets, updateTicketStatus } from '../services/ticketService';
import { Ticket, TicketStatus, Urgency } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filter, setFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const data = await getTickets();
    setTickets(data);
    setLoading(false);
  };

  const handleStatusUpdate = async (id: string, newStatus: TicketStatus) => {
    await updateTicketStatus(id, newStatus);
    await fetchTickets();
    if (selectedTicket?.id === id) {
      setSelectedTicket(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const filteredTickets = filter === 'ALL' ? tickets : tickets.filter(t => t.status === filter);

  const stats = [
    { name: 'Open', value: tickets.filter(t => t.status === TicketStatus.OPEN).length, color: '#ef4444' },
    { name: 'In Progress', value: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length, color: '#f59e0b' },
    { name: 'Resolved', value: tickets.filter(t => t.status === TicketStatus.RESOLVED).length, color: '#10b981' },
  ];

  const getUrgencyColor = (urgency: Urgency) => {
    switch (urgency) {
      case Urgency.CRITICAL: return 'bg-red-100 text-red-800';
      case Urgency.HIGH: return 'bg-orange-100 text-orange-800';
      case Urgency.MEDIUM: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-indigo-600 p-6 rounded-2xl shadow-sm text-white">
            <h4 className="text-indigo-100 text-sm font-medium uppercase">Total Tickets</h4>
            <p className="text-4xl font-bold mt-1">{tickets.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="text-gray-500 text-sm font-medium uppercase">Active Cases</h4>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {tickets.filter(t => t.status === TicketStatus.OPEN || t.status === TicketStatus.IN_PROGRESS).length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Manage Tickets</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Filter:</span>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border-gray-300 rounded-lg text-sm p-2 border"
            >
              <option value="ALL">All Statuses</option>
              <option value={TicketStatus.OPEN}>Open</option>
              <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
              <option value={TicketStatus.RESOLVED}>Resolved</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-gray-100">
          {/* List */}
          <div className="overflow-y-auto max-h-[600px]">
            {filteredTickets.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No tickets found.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {filteredTickets.map(ticket => (
                  <li 
                    key={ticket.id} 
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedTicket?.id === ticket.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-mono text-gray-500 uppercase">{ticket.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(ticket.urgency)}`}>
                        {ticket.urgency}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 truncate">{ticket.subject}</h4>
                    <p className="text-sm text-gray-500 truncate">{ticket.customerName}</p>
                    <div className="mt-2 flex items-center text-xs text-gray-400">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Details */}
          <div className="p-6 bg-gray-50/30">
            {selectedTicket ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedTicket.subject}</h2>
                    <p className="text-gray-500">{selectedTicket.customerName} &bull; {selectedTicket.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleStatusUpdate(selectedTicket.id, TicketStatus.IN_PROGRESS)}
                      className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200"
                    >
                      Process
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(selectedTicket.id, TicketStatus.RESOLVED)}
                      className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200"
                    >
                      Resolve
                    </button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h5>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <div className="bg-indigo-600 p-1.5 rounded-md mr-2">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h5 className="text-sm font-bold text-indigo-900">AI Category</h5>
                    </div>
                    <p className="text-sm text-indigo-800 font-medium">{selectedTicket.category}</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <div className="flex items-center mb-2">
                      <div className="bg-indigo-600 p-1.5 rounded-md mr-2">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h5 className="text-sm font-bold text-indigo-900">AI Summary</h5>
                    </div>
                    <p className="text-sm text-indigo-800 italic">"{selectedTicket.aiSummary}"</p>
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl text-indigo-100">
                  <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Suggested Fix (AI generated)
                  </h5>
                  <p className="text-sm leading-relaxed">{selectedTicket.aiSuggestedFix}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Select a ticket to view analysis and suggested actions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
