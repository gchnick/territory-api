import { AvailabilityEntity } from '../../../shared/models/types';

export type MeetingPlaceEntity = {
  id?: string;
  place: string;
  phone: string | null;
  field_service: boolean;
  latitude: string | null;
  longitude: string | null;
};

export type MeetingPlaceEntityWithAvailability = {
  availability: AvailabilityEntity[];
} & MeetingPlaceEntity;

export type Entity = MeetingPlaceEntity | MeetingPlaceEntityWithAvailability;
