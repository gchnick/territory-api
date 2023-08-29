import { HttpStatusCode } from '../models/http-status-code';
import { BaseError } from './base-error';

export class APIError extends BaseError {
  constructor(
    name: string,
    httpCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
    isOperational = true,
    description = 'internal server error'
  ) {
    super(name, httpCode, isOperational, description);
  }
}

export class HTTP400Error extends BaseError {
  constructor(description = 'bad request') {
    super('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, description);
  }
}

export class HTTP404Error extends BaseError {
  constructor(description = 'not fount') {
    super('NOT FOUND', HttpStatusCode.NOT_FOUNT, true, description);
  }
}
