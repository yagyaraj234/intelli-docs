export const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://workbot.site"
      : "http://localhost:3000", // Replace with your frontend URL
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
