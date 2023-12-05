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

export type Available = {
  frequency: string;
  moment: Moments;
};

export type Availability = Partial<Record<Days, Available>>;

export type AvailabilityEntity = {
  day: string;
  frequency: string;
  moment: string;
};
