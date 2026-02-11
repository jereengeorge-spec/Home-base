import React, { useState } from 'react';
import { createTicket } from '../services/ticketService';
import { Urgency } from '../types';

interface TicketFormProps {
  onSuccess: (id: string) => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    subject: '',
    description: '',
    urgency: Urgency.MEDIUM
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ticket = await createTicket(formData);
      onSuccess(ticket.id);
      setFormData({
        customerName: '',
        email: '',
        subject: '',
        description: '',
        urgency: Urgency.MEDIUM
      });
    } catch (error) {
      alert("Error creating ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-8 border-b border-gray-100 bg-indigo-50/50">
          <h2 className="text-2xl font-bold text-gray-900">Jereen George</h2>
          <p className="mt-2 text-sm text-gray-600">Our AI-enhanced team will analyze your request and get back to you shortly.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                required
                type="text"
                value={formData.customerName}
                onChange={e => setFormData({...formData, customerName: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Issue Subject</label>
            <input
              required
              type="text"
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
              placeholder="Briefly describe the problem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
              placeholder="What seems to be the issue?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Urgency</label>
            <select
              value={formData.urgency}
              onChange={e => setFormData({...formData, urgency: e.target.value as Urgency})}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
            >
              <option value={Urgency.LOW}>Low - Not urgent</option>
              <option value={Urgency.MEDIUM}>Medium - Affecting workflow</option>
              <option value={Urgency.HIGH}>High - Critical feature broken</option>
              <option value={Urgency.CRITICAL}>Critical - System down</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              disabled={loading}
              type="submit"
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI is analyzing your ticket...
                </span>
              ) : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};