import { Availability } from '../../shared/models/types';
import { Entity as MeetingPlaceEntity } from './meeting-place/types';

export enum CardinalPoint {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST'
}

export type Limits = Partial<Record<CardinalPoint, string>>;

export type MeetingPlace = {
  id?: string;
  place: string;
  phone?: string;
  latitude?: string;
  longitude?: string;
  fieldService: boolean;
  availavility?: Availability;
};

export type Territory = {
  id?: string;
  number: number;
  label: string;
  urlMapImage?: string;
  limits: Limits;
  lastDateCompleted: Date;
  isLocked: boolean;
  meetingPlaces?: MeetingPlace[];
};

export type PartialTerritory = Partial<Territory>;

export type TerritoryEntity = {
  id: string;
  number: number;
  label: string;
  north_limit: string;
  south_limit: string;
  east_limit: string;
  west_limit: string;
  last_date_completed: Date;
  url_map_image: string | null;
  assigned_lock: boolean;
};

export type TerritoryEntityWithMeetingPlaces = {
  meeting_places: MeetingPlaceEntity[];
} & TerritoryEntity;

export type Entity = TerritoryEntity | TerritoryEntityWithMeetingPlaces;
