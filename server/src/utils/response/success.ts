import { SuccessResponse } from "../../types/response";

export const ApiSuccess = <T>(message: string, data: T): SuccessResponse<T> => {
  return {
    status: "success",
    message,
    data,
    code: 200,
  };
};
