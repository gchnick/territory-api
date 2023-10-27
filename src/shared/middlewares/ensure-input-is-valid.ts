/* eslint-disable indent */
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

export const ensureInputIsValid =
  (schema: AnyZodObject) =>
  (request: Request, _: Response, next: NextFunction) => {
    const result = schema.safeParse({
      params: request.params,
      body: request.body,
      query: request.query,
    });

    if (!result.success) {
      next(result.error);
    }

    if (result.success) {
      const { params, body, query } = result.data;
      request.params = params;
      request.body = body;
      request.query = query;
      next();
    }
  };
