import { Availability } from 'src/territories/domain/interfaces/meeting-place.interface';
import { Territory } from 'src/territories/domain/territory';
import { Limits } from 'src/territories/domain/territory-limits';

export interface ITerritoryResponse {
  id: string;
  number: number;
  label: string;
  limits: Limits;
  map: string;
  isLocked: boolean;
  lastDateCompleted: Date;
  meetingPlaces?: {
    id: string;
    place: string;
    phone?: string;
    latitude: string;
    longitude: string;
    fieldService: boolean;
    availability?: Availability;
  }[];
}

export class TerritoryResponse {
  public readonly value: ITerritoryResponse;

  constructor(territory: Territory) {
    this.value = territory.toPrimitives();
  }
}
