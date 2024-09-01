const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || "development";

export const API_URL =
  APP_ENV === "development"
    ? "http://localhost:8000/api/v1/"
    : "https://intelli-docs-backend.vercel.app/api/v1/";
