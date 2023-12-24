import { Uuid } from '@shared/domain/value-object/uuid';

export class TerritoryControllerMother {
  static get REQUEST_TERRITORY_4() {
    return {
      id: Uuid.random().value,
      number: 4,
      label: 'Territory 4 of request',
      limits: {
        NORTH: 'NORTH',
        SOUTH: 'SOUTH',
        EAST: 'EAST',
        WEST: 'WEST',
      },
      lastDateCompleted: '2023-12-24',
    };
  }
}
