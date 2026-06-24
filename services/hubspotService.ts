
import { Ticket, TicketStatus, Urgency } from '../types';

const HUBSPOT_API_BASE = 'https://api.hubapi.com';

const getToken = (): string => process.env.HUBSPOT_ACCESS_TOKEN || '';

const hubspotFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  return fetch(`${HUBSPOT_API_BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
};

const urgencyToHubSpotPriority = (urgency: Urgency): string => {
  switch (urgency) {
    case Urgency.CRITICAL: return 'URGENT';
    case Urgency.HIGH: return 'HIGH';
    case Urgency.MEDIUM: return 'MEDIUM';
    default: return 'LOW';
  }
};

const statusToHubSpotStage = (status: TicketStatus): string => {
  switch (status) {
    case TicketStatus.IN_PROGRESS: return '3';
    case TicketStatus.RESOLVED:
    case TicketStatus.CLOSED: return '4';
    default: return '1';
  }
};

export const findOrCreateContact = async (email: string, name: string): Promise<string | null> => {
  const token = getToken();
  if (!token) return null;

  try {
    // Search for existing contact by email
    const searchRes = await hubspotFetch('/crm/v3/objects/contacts/search', {
      method: 'POST',
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
        properties: ['email', 'firstname', 'lastname'],
        limit: 1,
      }),
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.total > 0) {
        return searchData.results[0].id;
      }
    }

    // Create new contact
    const nameParts = name.trim().split(' ');
    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(' ') || '';

    const createRes = await hubspotFetch('/crm/v3/objects/contacts', {
      method: 'POST',
      body: JSON.stringify({
        properties: { email, firstname, lastname },
      }),
    });

    if (createRes.ok) {
      const contact = await createRes.json();
      return contact.id;
    }
  } catch {
    // Non-fatal: CRM sync failure shouldn't block ticket creation
  }

  return null;
};

export const createHubSpotTicket = async (ticket: Ticket): Promise<string | null> => {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await hubspotFetch('/crm/v3/objects/tickets', {
      method: 'POST',
      body: JSON.stringify({
        properties: {
          subject: `[${ticket.id}] ${ticket.subject}`,
          content: `${ticket.description}\n\nAI Summary: ${ticket.aiSummary || ''}\n\nAI Category: ${ticket.category}\n\nAI Suggested Fix: ${ticket.aiSuggestedFix || ''}`,
          hs_pipeline: '0',
          hs_pipeline_stage: statusToHubSpotStage(ticket.status),
          hs_ticket_priority: urgencyToHubSpotPriority(ticket.urgency),
          source_type: 'EMAIL',
        },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.id;
    }
  } catch {
    // Non-fatal
  }

  return null;
};

export const associateContactWithTicket = async (contactId: string, ticketId: string): Promise<void> => {
  const token = getToken();
  if (!token) return;

  try {
    await hubspotFetch('/crm/v4/associations/ticket/contact/batch/create', {
      method: 'POST',
      body: JSON.stringify({
        inputs: [{ from: { id: ticketId }, to: { id: contactId }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 16 }] }],
      }),
    });
  } catch {
    // Non-fatal
  }
};

export const updateHubSpotTicketStatus = async (hubspotTicketId: string, status: TicketStatus): Promise<void> => {
  const token = getToken();
  if (!token) return;

  try {
    await hubspotFetch(`/crm/v3/objects/tickets/${hubspotTicketId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        properties: {
          hs_pipeline_stage: statusToHubSpotStage(status),
        },
      }),
    });
  } catch {
    // Non-fatal
  }
};

export const syncTicketToHubSpot = async (ticket: Ticket): Promise<{ contactId: string | null; ticketId: string | null }> => {
  const contactId = await findOrCreateContact(ticket.email, ticket.customerName);
  const hsTicketId = await createHubSpotTicket(ticket);

  if (contactId && hsTicketId) {
    await associateContactWithTicket(contactId, hsTicketId);
  }

  return { contactId, ticketId: hsTicketId };
};

export const getHubSpotTicketUrl = (hubspotTicketId: string): string =>
  `https://app.hubspot.com/contacts/tickets/${hubspotTicketId}`;
