import { ErrorModel } from '../models/error-model';
import { HttpStatusCode } from '../models/http-status-code';

export class BaseError extends ErrorModel {
  readonly name: string;
  readonly httpCode: HttpStatusCode;

  constructor(
    name: string,
    httpCode: HttpStatusCode,
    isOperational: boolean,
    description: string
  ) {
    super(description, isOperational);
    this.name = name;
    this.httpCode = httpCode;
  }
}
