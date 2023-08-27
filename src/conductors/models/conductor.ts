enum Days {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

enum Moments {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT'
}

type Available = {
  frequency: string;
  moment: Moments;
};

enum Privilegies {
  GROUP_OVERSEER = 'GROUP_OVERSEER',
  GROUP_SERVANT = 'GROUP_SERVANT',
  QUALIFIED_BROTHER = 'QUALIFIED_BROTHER'
}

type Availability = Partial<Record<Days, Available>>;

type Conductor = {
  id?: string;
  name: string;
  mobilePhone: string;
  serviceGroup: number;
  privilegie: Privilegies;
  lastDateAssigned?: Date;
  availability?: Availability;
};

type PartialConductor = Partial<Conductor>;

type AvailabilityEntity = {
  day: string;
  frequency: string;
  moment: string;
  conductor_id: string;
};

type ConductorEntity = {
  id: string;
  name: string;
  mobile_phone: string;
  service_group: number;
  privilege: string;
  last_date_assigned: Date;
};

type ConductorWithAvailability = {
  Availability: AvailabilityEntity[];
} & ConductorEntity;

type Entity = ConductorEntity | ConductorWithAvailability;

export {
  Availability,
  AvailabilityEntity,
  Conductor,
  ConductorEntity,
  ConductorWithAvailability,
  Days,
  Entity,
  Moments,
  PartialConductor,
  Privilegies
};
