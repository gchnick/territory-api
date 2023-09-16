import { Availability } from '../../shared/models/types';

export type SetMeetingPlaceAvailability = {
  place: string;
  phone: string;
  fieldService: boolean;
  availability: Availability;
};
