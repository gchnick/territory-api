import { BadRequest, NotFount } from '../../shared/models/error-model';

export class TerritoryNotFount extends NotFount {
  constructor(message: string) {
    super(message);
  }
}

export class NumberTerritoryAlreadyRegistry extends BadRequest {
  constructor(message: string) {
    super(message);
  }
}
