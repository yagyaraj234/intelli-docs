import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { ApiError } from "../utils/response/error";
import * as dotenv from "dotenv";

dotenv.config();

// Middleware to check if the user is logged in
export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies["intelli-doc-token"] ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json(ApiError("You are not authorized to access this route.", 401));
    }
    let decoded;

    try {
      decoded = Jwt.verify(
        token,
        (process.env.JWT_SECRET as string) ||
          `5XlyohERHY6hfkEOVUoacazXMFjHrP4MkHHBtgv4uTmIECpW36cGCpI`
      );
    } catch (error) {
      return res
        .status(401)
        .json(ApiError("You are not authorized to access this route.", 401));
    }

    if (!decoded) {
      return res
        .status(401)
        .json(ApiError("You are not authorized to access this route", 401));
    }

    req.user = decoded as any;
    // @ts-ignore
    req.body.uid = decoded.uid as string;
    // @ts-ignore
    req.body.plan = decoded?.plan === "free" && false && true;

    next();
  } catch (error) {
    return res
      .status(401)
      .json(ApiError("You are not authorized to access this route", 401));
  }
};
