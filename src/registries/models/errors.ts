import { BadRequest, NotFount } from '../../shared/models/error-model';

export class RegistryNotFount extends NotFount {
  constructor(message: string) {
    super(message);
  }
}

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

export class PeriodIsStart extends BadRequest {
  constructor(message: string) {
    super(message);
  }
}
