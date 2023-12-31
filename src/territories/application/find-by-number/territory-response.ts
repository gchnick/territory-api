import { Territory } from '@territories/domain/territory';

export interface ITerritoryResponse {
  id: string;
  number: number;
  label: string;
  limits: {
    cardinalPoint: string;
    limit: string;
  }[];
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
    availability?: {
      day: string;
      available: {
        frequency: string;
        moment: string;
      };
    }[];
  }[];
}

export class TerritoryResponse {
  public readonly value: ITerritoryResponse;

  constructor(territory: Territory) {
    this.value = territory.toPrimitives();
  }
}
