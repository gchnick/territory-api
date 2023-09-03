import { NextFunction, Request, Response } from 'express';
import { NotFount } from '../models/error-model';

export const invalidPathMiddleware = (
  request: Request,
  _: Response,
  next: NextFunction
) => {
  const message = `Can't find '${request.originalUrl}' on the server!`;
  const error = new NotFount(message);
  next(error);
};
