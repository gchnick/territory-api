import { NotFount } from '../../shared/models/error-model';

export class MeetingPlaceNotFount extends NotFount {
  constructor(message: string) {
    super(message);
  }
}
