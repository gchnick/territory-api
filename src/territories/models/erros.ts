import { BadRequest, NotFount } from '../../shared/models/errors';

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
