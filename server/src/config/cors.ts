export const corsOptions = {
  origin: process.env.APP_URL || "http://localhost:3000", // Replace with your frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  exposedHeaders: ["Location"],
  maxAge: 3600,
};
