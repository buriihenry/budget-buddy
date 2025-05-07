import { createMiddleware, tokenBucket } from "@arcjet/next";

const aj = createMiddleware({
  key: process.env.ARCJET_KEY,
  rules: [
    // Rate limiting specifically for collection creation
    tokenBucket({
      mode: "LIVE",
      refillRate: 10, // 10 collections
      interval: 3600, // per hour
      capacity: 10, // maximum burst capacity
    }),
  ],
});

export default aj;