import { Uuid } from '@shared/domain/value-object/uuid';

export class TerritoryMother {
  static territoryRequest() {
    return {
      id: Uuid.random().value,
      number: 1,
      label: 'Name of territory',
      limits: {
        NORTH: 'NORTH',
        SOUTH: 'SOUTH',
        EAST: 'EAST',
        WEST: 'WEST',
      },
      lastDateCompleted: '2023-12-20',
    };
  }
}
