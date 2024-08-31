import { ErrorResponse } from "../../types/response";
export const ApiError = (
  message: string,
  code?: number,
  details?: any
): ErrorResponse => {
  return {
    status: "error",
    message,
    code,
    details,
  };
};
