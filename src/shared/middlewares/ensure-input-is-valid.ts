import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import { HTTP400Error } from '../controllers/errors';

export const ensureInputIsValid =
  (schema: AnyZodObject) =>
  (request: Request, _: Response, next: NextFunction) => {
    const result = schema.safeParse({
      params: request.params,
      body: request.body,
      query: request.query
    });

    if (!result.success) {
      next(result.error);
    }

    if (result.success) next();
  };

export const ensurePartialInputIsValid =
  (schema: AnyZodObject) =>
  (request: Request, _: Response, next: NextFunction) => {
    const result = schema.partial().safeParse(request.body);

    if (!result.success) {
      const error = new HTTP400Error(JSON.parse(result.error.message));
      next(error);
    }

    if (result.success) next();
  };
