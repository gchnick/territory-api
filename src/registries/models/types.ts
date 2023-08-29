import { Conductor } from '../../conductors/models/types';
import { Territory } from '../../territories/models/types';

export type Registry = {
  id?: string;
  territoryAssigned?: Territory;
  assignedTo?: Conductor;
  dateAssigned: Date;
  dateCompleted?: Date;
};

export type PartialRegistry = Partial<Registry>;

export type RegistryEntity = {
  id: string;
  date_assigned: Date;
  date_completed: Date | null;
  territory_id: string;
  conductor_id: string;
};

export type PartialRegistryEntity = Partial<RegistryEntity>;
