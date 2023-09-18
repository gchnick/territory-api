import { NotFount } from '../../shared/models/error-model';

export class ProgramNotFount extends NotFount {
  constructor(message: string) {
    super(message);
  }
}

export class AssignamentNotFount extends NotFount {
  constructor(message: string) {
    super(message);
  }
}
