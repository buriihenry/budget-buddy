import { serve } from "inngest/next";

import { inngest } from "@/lib/inngest/client";
import {
  checkBudgetAlerts,
  generateMonthlyReports,
  processRecurringTransaction,
  triggerRecurringTransactions,
} from "@/lib/inngest/functions";

// Create the Inngest handler with error handling
const handler = serve({
  client: inngest,
  functions: [
    processRecurringTransaction,
    triggerRecurringTransactions,
    generateMonthlyReports,
    checkBudgetAlerts, 
  ],
  middleware: [
    async (req) => {
      try {
        // Log request details for debugging
        console.log('Inngest webhook request:', {
          method: req.method,
          url: req.url,
          headers: Object.fromEntries(req.headers.entries()),
        });
        
        return req;
      } catch (error) {
        console.error('Inngest middleware error:', error);
        throw error;
      }
    }
  ]
});

// Export the handler with error handling
export const { GET, POST, PUT } = handler; 