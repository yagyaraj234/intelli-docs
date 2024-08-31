// import { FirebaseApp } from "@firebase/app";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "utils/response/error";
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
        code: 401,
      });
    }

    req.body.uid = "fdsjkn";

    // const user = await firebaseApp.auth().verifyIdToken(token);
  } catch (error) {
    console.log(error);
    return res.status(500).json(ApiError("Internal server error", 500, error));
  }
};
