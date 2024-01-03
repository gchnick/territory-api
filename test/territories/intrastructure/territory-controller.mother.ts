import { faker } from '@faker-js/faker';

export class TerritoryControllerMother {
  static requestCreate({
    id = faker.string.uuid(),
    number = faker.number.int({ min: 1, max: 100 }),
    label = faker.location.city(),
    limits = [
      { cardinalPoint: 'NORTH', limit: faker.location.streetAddress() },
      { cardinalPoint: 'SOUTH', limit: faker.location.streetAddress() },
      { cardinalPoint: 'EAST', limit: faker.location.streetAddress() },
      { cardinalPoint: 'WEST', limit: faker.location.streetAddress() },
    ],
    lastDateCompleted = faker.date.past(),
  } = {}) {
    return {
      id,
      number,
      label,
      limits,
      lastDateCompleted,
    };
  }
}
