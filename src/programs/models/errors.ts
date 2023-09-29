import { BadRequest, NotFount } from '../../shared/models/error-model';

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

export class DateOutsideProgram extends BadRequest {
  constructor(message: string) {
    super(message);
  }
}

export class AlreadyProgram extends BadRequest {
  constructor(message: string) {
    super(message);
  }
}
