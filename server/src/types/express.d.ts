import { Request } from "express";

interface User {
  email: string;
  uid: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
