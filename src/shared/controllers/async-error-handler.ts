import { NextFunction, Request, Response } from 'express';

export const asyncErrorHandler = (
  func: (
    request: Request,
    response: Response,
    next: NextFunction
  ) => Promise<unknown>
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    func(request, response, next).catch(error => next(error));
  };
};
