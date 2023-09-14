import { Conductor } from '../../conductors/models/types';
import { Territory } from '../../territories/models/types';

export type Registry = {
  id?: string;
  territoryAssigned?: Territory;
  assignedTo?: Conductor;
  assignedDate: Date;
  completionDate?: Date;
};

export type PartialRegistry = Partial<Registry>;

export type Period = {
  id?: string;
  description: string;
  startDate?: Date;
  finishDate?: Date;
};

export type PartialPeriod = Partial<Period>;

export type PeriodEntity = {
  id: string;
  description: string;
  start_date: Date;
  finish_date: Date | null;
};

export type RegistryEntity = {
  id: string;
  assigned_date: Date;
  completion_date: Date | null;
  territory_id: string;
  conductor_id: string;
};

export type PartialRegistryEntity = Partial<RegistryEntity>;
