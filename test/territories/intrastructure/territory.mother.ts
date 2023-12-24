import { Uuid } from '@shared/domain/value-object/uuid';
import { Territory } from '@territories/domain/territory';

export class TerritoryMother {
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

  static get INITIAL_TERRITORIES(): Territory[] {
    return [
      Territory.fromPrimitives({
        id: Uuid.random().value,
        number: 1,
        label: 'Territory 1',
        limits: {
          NORTH: 'NORTH',
          SOUTH: 'SOUTH',
          EAST: 'EAST',
          WEST: 'WEST',
        },
        map: undefined,
        isLocked: false,
        lastDateCompleted: new Date('2023-12-20'),
        meetingPlaces: [],
      }),
      Territory.fromPrimitives({
        id: Uuid.random().value,
        number: 2,
        label: 'Territory 2',
        limits: {
          NORTH: 'NORTH',
          SOUTH: 'SOUTH',
          EAST: 'EAST',
          WEST: 'WEST',
        },
        map: undefined,
        isLocked: false,
        lastDateCompleted: new Date('2023-12-21'),
        meetingPlaces: [],
      }),
      Territory.fromPrimitives({
        id: Uuid.random().value,
        number: 3,
        label: 'Territory 3',
        limits: {
          NORTH: 'NORTH',
          SOUTH: 'SOUTH',
          EAST: 'EAST',
          WEST: 'WEST',
        },
        map: undefined,
        isLocked: true,
        lastDateCompleted: new Date('2023-12-22'),
        meetingPlaces: [],
      }),
    ];
  }
}
