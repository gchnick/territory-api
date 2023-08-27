import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

export const ensureInputIsValid =
  (schema: AnyZodObject) =>
  (request: Request, response: Response, next: NextFunction) => {
    const result = schema.safeParse({
      params: request.params,
      body: request.body,
      query: request.query
    });

    if (!result.success) {
      return response
        .status(400)
        .send({ error: JSON.parse(result.error.message) });
    }

    next();
  };

export const ensurePartialInputIsValid =
  (schema: AnyZodObject) =>
  (request: Request, response: Response, next: NextFunction) => {
    const result = schema.partial().safeParse(request.body);

    if (!result.success) {
      return response
        .status(400)
        .send({ error: JSON.parse(result.error.message) });
    }

    next();
  };
