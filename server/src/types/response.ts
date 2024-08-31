export interface SuccessResponse<T> {
  status: "success";
  message: string;
  data: T;
  code: number;
}

export interface ErrorResponse {
  status: "error";
  message: string;
  code?: number;
  details?: any;
}
