import { NextFunction, Request, Response } from 'express';
import { APIError } from '../controllers/errors';
import { HttpStatusCode } from '../models/http-status-code';

export const invalidPathMiddleware = (
  request: Request,
  _: Response,
  next: NextFunction
) => {
  const message = `Can't find '${request.originalUrl}' on the server!`;
  const error = new APIError('fail', HttpStatusCode.NOT_FOUNT, true, message);
  next(error);
};
