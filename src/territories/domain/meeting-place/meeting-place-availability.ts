import { Availability } from '../interfaces/meeting-place.interface';

export class MeetingPlaceAvailability {
  readonly values: Availability;

  constructor(values: Availability) {
    this.values = values;
  }
}
