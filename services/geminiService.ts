import { GoogleGenAI, Type } from "@google/genai";
import { Ticket, Urgency } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTicket = async (ticket: Partial<Ticket>) => {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `You are the AI triage agent for Jereen George. 
    Analyze this ticket for Jereen George:
    Subject: ${ticket.subject}
    Description: ${ticket.description}
    
    Please provide:
    1. A concise summary (max 20 words).
    2. A suggested category (e.g., Billing, Software Bug, Hardware, Account Access).
    3. A brief suggested technical fix or next step for the Jereen George team.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          category: { type: Type.STRING },
          suggestedFix: { type: Type.STRING }
        },
        required: ["summary", "category", "suggestedFix"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return null;
  }
};

export const generateDeploymentGuide = () => {
  return `
  ### Deployment Steps for Google Cloud (GCP)
  
  1. **Firebase Hosting & Firestore (Most Cost-Effective)**
     - Go to the [Firebase Console](https://console.firebase.google.com/).
     - Create a project. Enable "Firestore Database" in Native Mode.
     - Enable "Cloud Functions" (requires Blaze plan, but has free tier).
     - Run \`npm install -g firebase-tools\` and \`firebase init\`.
  
  2. **Custom Domain Acquisition**
     - Use **Google Domains** or **Cloud Domains** (approx $12/year).
     - Or use **Namecheap** or **Cloudflare** for budget-friendly (.com, .net) or ultra-low cost (.tech, .xyz) options.
     - Connect your domain in the Firebase Hosting dashboard via the "Add Custom Domain" wizard.
  
  3. **Backend Logic (Cloud Functions)**
     - Wrap the logic in \`services/ticketService.ts\` inside a Firebase Function triggered by an HTTP request or Firestore hook.
  
  4. **Cost Tips**
     - Stay within Firestore's **Free Tier** (50k reads/day, 20k writes/day).
     - Use **Cloud Run** if you prefer a containerized backend; it scales to zero when not in use.
  `;
};