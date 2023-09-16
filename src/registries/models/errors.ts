import { BadRequest, NotFount } from '../../shared/models/error-model';

export class LastRegistryNotFount extends NotFount {
  constructor(message: string) {
    super(message);
  }
}

export class LastPeriodNotFount extends NotFount {
  constructor(message: string) {
    super(message);
  }
}

export class PeriodNotFount extends NotFount {
  constructor(message: string) {
    super(message);
  }
}

export class TerritoryIsLocked extends BadRequest {
  constructor(message: string) {
    super(message);
  }
}
