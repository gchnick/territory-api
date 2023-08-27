import { NotFount } from '../../shared/models/errors';

export class ConductorNotFount extends NotFount {
  constructor(message: string) {
    super(message);
  }
}
