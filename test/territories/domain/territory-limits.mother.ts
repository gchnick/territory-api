import { faker } from '@faker-js/faker';
import { TerritoryLimits } from '@territories/domain/territory-limits';

export class TerritoryLimitsMother {
  static create({
    north = faker.location.streetAddress(),
    south = faker.location.streetAddress(),
    east = faker.location.streetAddress(),
    west = faker.location.streetAddress(),
  } = {}): TerritoryLimits {
    return TerritoryLimits.fromPrimitives([
      { cardinalPoint: 'NORTH', limit: north },
      { cardinalPoint: 'SOUTH', limit: south },
      { cardinalPoint: 'EAST', limit: east },
      { cardinalPoint: 'WEST', limit: west },
    ]);
  }
}
