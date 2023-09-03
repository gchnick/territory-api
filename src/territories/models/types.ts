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
  latitude?: string;
  longitude?: string;
};

export type Territory = {
  id?: string;
  number: number;
  label: string;
  limits: Limits;
  lastDateCompleted: Date;
  isLocked: boolean;
  meetingPlaces?: MeetingPlace[];
};

export type PartialTerritory = Partial<Territory>;

export type MeetingPlaceEntity = {
  id?: string;
  place: string;
  latitude: string | null;
  longitude: string | null;
};

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
  MeetingPlaces: MeetingPlaceEntity[];
} & TerritoryEntity;

export type Entity = TerritoryEntity | TerritoryEntityWithMeetingPlaces;
