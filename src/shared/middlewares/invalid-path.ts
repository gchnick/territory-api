import { NextFunction, Request, Response } from 'express';

export const invalidPath = (
  _: Request,
  response: Response,
  next: NextFunction
) => {
  response.status(404);
  response.json({ error: 'invalid path' });
  next();
};
