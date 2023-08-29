import { BadRequest, NotFount } from '../../shared/models/error-model';

export class InvalidParams extends BadRequest {
  constructor(message: string) {
    super(message);
  }
}

export class LastRegistryNotFount extends NotFount {
  constructor(message: string) {
    super(message);
  }
}

export class TerritoryIsLocked extends BadRequest {
  constructor(message: string) {
    super(message);
  }
}
