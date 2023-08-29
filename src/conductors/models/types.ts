export enum Days {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

export enum Moments {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT'
}

export type Available = {
  frequency: string;
  moment: Moments;
};

export enum Privilegies {
  GROUP_OVERSEER = 'GROUP_OVERSEER',
  GROUP_SERVANT = 'GROUP_SERVANT',
  QUALIFIED_BROTHER = 'QUALIFIED_BROTHER'
}

export type Availability = Partial<Record<Days, Available>>;

export type Conductor = {
  id?: string;
  name: string;
  mobilePhone: string;
  serviceGroup: number;
  privilegie: Privilegies;
  lastDateAssigned?: Date;
  availability?: Availability;
};

export type PartialConductor = Partial<Conductor>;

export type AvailabilityEntity = {
  day: string;
  frequency: string;
  moment: string;
  conductor_id: string;
};

export type ConductorEntity = {
  id: string;
  name: string;
  mobile_phone: string;
  service_group: number;
  privilege: string;
  last_date_assigned: Date;
};

export type ConductorWithAvailability = {
  Availability: AvailabilityEntity[];
} & ConductorEntity;

export type Entity = ConductorEntity | ConductorWithAvailability;
