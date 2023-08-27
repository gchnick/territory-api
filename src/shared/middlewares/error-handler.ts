import { NextFunction, Request, Response } from 'express';
import { BadRequest, NotFount } from '../models/errors';

export const errorHandler = (
  error: Error,
  _: Request,
  response: Response,
  next: NextFunction
) => {
  let status = 500;

  if (error instanceof NotFount) {
    status = 404;
  }

  if (error instanceof BadRequest) {
    status = 400;
  }

  response.status(status).json({ error: error.message });
  next();
};
