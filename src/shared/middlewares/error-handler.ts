import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../models/error-handler';

export const errorHandlerMiddleware = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const isTruestedError = ErrorHandler.isTrustedError(error);
  if (!isTruestedError) {
    next(error);
  }

  const { httpCode, message, name, stack } = ErrorHandler.handleError(error);
  response.status(httpCode).json({ error: name, message, stack });
};
