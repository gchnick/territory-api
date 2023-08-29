import { NextFunction, Request, Response } from 'express';

export const fieldsToDate =
  (fieldNames: string[]) =>
  (request: Request, _: Response, next: NextFunction) => {
    fieldNames.forEach((field) => {
      const value = request.body[field];
      if (request.body[field]) {
        request.body[field] = new Date(value);
      }
    });

    next();
  };
