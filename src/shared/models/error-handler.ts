import { ZodError } from 'zod';
import { BaseError } from '../controllers/base-error';
import { HTTP400Error, HTTP404Error } from '../controllers/errors';
import { ErrorModel, NotFount } from './error-model';

export class ErrorHandler {
  static handleError(error: Error): BaseError | ZodError {
    if (error instanceof ZodError) {
      return error;
    }

    if (error instanceof NotFount) {
      return new HTTP404Error(error.message);
    }
    // BAD REQUEST
    return new HTTP400Error(error.message);
  }

  static isTrustedError(error: Error) {
    if (error instanceof ErrorModel) {
      return error.isOperational;
    }

    if (error instanceof ZodError) {
      return true;
    }

    return false;
  }
}
