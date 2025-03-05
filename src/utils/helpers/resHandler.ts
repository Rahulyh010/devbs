import { Response } from "express";

interface ResHandlerProps {
  res: Response;
  success?: boolean;
  message: string;
  data?: any;
  code?: number;
  error?: unknown;
}

export const resHandler = ({
  res,
  success = true,
  message,
  data = null,
  code = 200,
  error = null,
}: ResHandlerProps) => {
  let errorMessage = null;

  if (error) {
    if (error instanceof Error) {
      errorMessage = error.message; // Extract error message safely
    } else if (typeof error === "string") {
      errorMessage = error; // Directly use string errors
    } else {
      errorMessage = JSON.stringify(error); // Convert objects to string
    }
  }
  return res.status(code).json({
    success,
    message,
    data,
    error: errorMessage,
  });
};
