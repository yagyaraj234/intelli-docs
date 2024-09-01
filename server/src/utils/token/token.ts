import Jwt from "jsonwebtoken";

export const generateToken = (payload: any): string => {
  return Jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};
