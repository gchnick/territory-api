import { Availability, AvailabilityEntity } from '../../shared/models/types';

export enum Privilegies {
  GROUP_OVERSEER = 'GROUP_OVERSEER',
  GROUP_SERVANT = 'GROUP_SERVANT',
  QUALIFIED_BROTHER = 'QUALIFIED_BROTHER'
}

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
