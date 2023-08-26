import { Request } from 'express';

export interface RequestBody<T> extends Request {
  body: T;
}
