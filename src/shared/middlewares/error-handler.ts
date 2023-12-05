import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { BaseError } from '../controllers/base-error';
import { ErrorHandler } from '../models/error-handler';
import { HttpStatusCode } from '../models/http-status-code';

export const errorHandlerMiddleware = (
  error: Error,
  _: Request,
  response: Response,
  next: NextFunction
) => {
  const isTruestedError = ErrorHandler.isTrustedError(error);
  if (!isTruestedError) {
    next(error);
  }

  let httpCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
  let message: unknown;
  let name = '';
  let stack: string | undefined;

  const _error = ErrorHandler.handleError(error);
  if (_error instanceof BaseError) {
    httpCode = _error.httpCode;
    message = _error.message;
    name = _error.name;
    // stack = _error.stack;
  }

  if (_error instanceof ZodError) {
    name = 'BAD REQUEST';
    httpCode = HttpStatusCode.BAD_REQUEST;
    message = _error.format();
  }

  response.status(httpCode).json({ status: name, message, stack });
};
