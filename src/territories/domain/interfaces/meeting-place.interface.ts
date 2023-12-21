export enum Days {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum Moments {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
}

type Available = {
  frequency: string;
  moment: Moments;
};

export type Availability = Partial<Record<Days, Available>>;

export type IMeetingPlace = {
  id?: string;
  place: string;
  phone?: string;
  latitude?: string;
  longitude?: string;
  fieldService: boolean;
  availability?: Availability;
};

export type PartialIMeetingPlace = Partial<IMeetingPlace>;
