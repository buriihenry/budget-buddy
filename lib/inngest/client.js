import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "budget-buddy-platform", // Unique app ID
  name: "Budget Buddy Platform",
  retryFunction: async (attempt) => ({
    delay: Math.pow(2, attempt) * 1000, // Exponential backoff
    maxAttempts: 2,
  }),
});