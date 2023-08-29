import { BadRequest, NotFount } from '../../shared/models/error-model';

export class ConductorNotFount extends NotFount {
  constructor(message: string) {
    super(message);
  }
}

export class MobilePhoneAlreadyRegistry extends BadRequest {
  constructor(message: string) {
    super(message);
  }
}
