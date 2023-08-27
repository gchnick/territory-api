import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const fieldToDate =
  (fieldName: string) =>
  (request: Request, response: Response, next: NextFunction) => {
    if (!request.body[fieldName]) return next();

    const value = request.body[fieldName];
    if (!ensureDateIsValid(value)) {
      return response.status(400).send({
        error: { path: `/${fieldName}`, message: 'string to date is invalid' }
      });
    }

    request.body[fieldName] = new Date(value);
    next();
  };

const ensureDateIsValid = (value: string) => {
  const dateSchema = z.string().nonempty();
  const result = dateSchema.safeParse(value);
  return result.success;
};
