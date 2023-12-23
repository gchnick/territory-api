import { generatorUuid } from '@shared/domain/generator-uuid';

export class TerritoryMother {
  static territoryRequest() {
    return {
      id: generatorUuid(),
      number: 1,
      label: 'Name of territory',
      limits: {
        NORTH: 'NORTH',
        SOUTH: 'SOUTH',
        EAST: 'EAST',
        WEST: 'WEST',
      },
    };
  }
}
