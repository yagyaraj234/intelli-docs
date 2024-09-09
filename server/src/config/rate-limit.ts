import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 100, // Limit each IP to 100 requests per

  message: "Too many requests from this IP, please try again after a minute", // message to send
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false,
});
