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
      alert("Something went wrong. George will be right with you — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero story block */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          You didn't sign up to be<br />
          <span className="text-indigo-600">their IT department.</span>
        </h1>
        <p className="mt-4 text-gray-500 text-base max-w-lg mx-auto leading-relaxed">
          Tell George what's going on. He'll handle it — patiently, clearly, and without making anyone feel silly for asking.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-100 bg-indigo-50/50 flex items-center space-x-4">
          <div className="bg-indigo-600 rounded-full p-3 flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Talk to George</h2>
            <p className="text-sm text-gray-500">Available 24/7. Patient every time. No hold music.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your name</label>
              <input
                required
                type="text"
                value={formData.customerName}
                onChange={e => setFormData({...formData, customerName: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                placeholder="e.g. Margaret"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">What's going on?</label>
            <input
              required
              type="text"
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
              placeholder="e.g. My iPad won't open email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tell George the whole story</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
              placeholder="Don't worry about technical details — just describe what's happening and what you were trying to do."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">How urgent is this?</label>
            <select
              value={formData.urgency}
              onChange={e => setFormData({...formData, urgency: e.target.value as Urgency})}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
            >
              <option value={Urgency.LOW}>Not urgent — whenever George is free</option>
              <option value={Urgency.MEDIUM}>It's affecting my day but I can wait</option>
              <option value={Urgency.HIGH}>I really need this working today</option>
              <option value={Urgency.CRITICAL}>Everything is down — I need help now</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              disabled={loading}
              type="submit"
              className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  George is on it...
                </span>
              ) : "Let George handle it"}
            </button>
            <p className="mt-3 text-center text-xs text-gray-400">
              George never makes you feel silly for asking. That's kind of his whole thing.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
