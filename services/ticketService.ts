
import { Ticket, TicketStatus, Urgency } from "../types";
import { analyzeTicket } from "./geminiService";

const STORAGE_KEY = 'jereen_george_tickets';

const getStoredTickets = (): Ticket[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveTickets = (tickets: Ticket[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
};

export const createTicket = async (ticketData: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'aiSummary' | 'aiSuggestedFix' | 'category'>): Promise<Ticket> => {
  const tickets = getStoredTickets();
  
  // AI Triage
  const analysis = await analyzeTicket(ticketData);
  
  const newTicket: Ticket = {
    ...ticketData,
    id: `TIC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    status: TicketStatus.OPEN,
    createdAt: new Date().toISOString(),
    category: analysis?.category || "General",
    aiSummary: analysis?.summary || "No summary available.",
    aiSuggestedFix: analysis?.suggestedFix || "Manual review required."
  };

  tickets.unshift(newTicket);
  saveTickets(tickets);
  return newTicket;
};

export const getTickets = async (): Promise<Ticket[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getStoredTickets()), 300);
  });
};

export const updateTicketStatus = async (id: string, status: TicketStatus): Promise<void> => {
  const tickets = getStoredTickets();
  const index = tickets.findIndex(t => t.id === id);
  if (index !== -1) {
    tickets[index].status = status;
    saveTickets(tickets);
  }
};

export const getTicketById = async (id: string): Promise<Ticket | null> => {
  const tickets = getStoredTickets();
  return tickets.find(t => t.id === id) || null;
};