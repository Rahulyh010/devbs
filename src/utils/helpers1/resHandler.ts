import { Response } from "express";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
  meta?: object;
}

export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any = null,
  meta: object = {}
) => {
  const response: ApiResponse = {
    success: statusCode < 400,
    message,
    ...(data && { data }),
    ...(Object.keys(meta).length && { meta }),
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  error: any = null
) => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(error && { error }),
  };
  return res.status(statusCode).json(response);
};
