import { faker } from '@faker-js/faker';
import { Territory } from '@territories/domain/territory';

export class TerritoryMother {
  static createInicialTerritories(count = 50): Territory[] {
    const territory: Territory[] = [];
    for (let i = 0; i < count; i++) {
      territory.push(this.create({ number: i + 1 }));
    }
    return territory;
  }

  static create({
    id = faker.string.uuid(),
    number = faker.number.int({ min: 1, max: 100 }),
    label = faker.location.city(),
    limits = [
      { cardinalPoint: 'NORTH', limit: faker.location.streetAddress() },
      { cardinalPoint: 'SOUTH', limit: faker.location.streetAddress() },
      { cardinalPoint: 'EAST', limit: faker.location.streetAddress() },
      { cardinalPoint: 'WEST', limit: faker.location.streetAddress() },
    ],
    map = faker.image.url(),
    isLocked = faker.datatype.boolean(0.75),
    lastDateCompleted = faker.date.past(),
    meetingPlaces = [],
  } = {}): Territory {
    return Territory.fromPrimitives({
      id,
      number,
      label,
      limits,
      map,
      isLocked,
      lastDateCompleted,
      meetingPlaces,
    });
  }
}
