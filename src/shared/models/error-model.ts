export class ErrorModel extends Error {
  readonly isOperational: boolean;
  constructor(message: string, isOperational: boolean) {
    super(message);
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this);
  }
}

export class NotFount extends ErrorModel {
  constructor(message: string) {
    super(message, true);
  }
}

export class BadRequest extends ErrorModel {
  constructor(message: string) {
    super(message, true);
  }
}

export class InvalidParams extends BadRequest {
  constructor(message: string) {
    super(message);
  }
}
