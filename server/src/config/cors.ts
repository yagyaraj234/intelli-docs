export const corsOptions = {
  origin: "https://workbot.site", // Replace with your frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Connection",
    "Cache-Control",
    "Accept",
  ],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  exposedHeaders: ["Content-Type", "Cache-Control", "Connection"],
  maxAge: 3600,
};
