import { faker } from '@faker-js/faker';
import { TerritoryLimitsMother } from './territory-limits.mother';

describe('TerritoryLimits should', () => {
  it('return limit value', () => {
    // Arrange
    const expectedNorthLimit = faker.location.streetAddress();
    const expectedSouthLimit = faker.location.streetAddress();
    const expectedEastLimit = faker.location.streetAddress();
    const expectedWestLimit = faker.location.streetAddress();

    const limits = TerritoryLimitsMother.create({
      north: expectedNorthLimit,
      south: expectedSouthLimit,
      east: expectedEastLimit,
      west: expectedWestLimit,
    });

    // Act
    const currentNorthLimit = limits.north;
    const currentSouthLimit = limits.south;
    const currentEastLimit = limits.east;
    const currentWestLimit = limits.west;

    // Assert
    expect(currentNorthLimit).toBe(expectedNorthLimit);
    expect(expectedSouthLimit).toBe(currentSouthLimit);
    expect(expectedEastLimit).toBe(currentEastLimit);
    expect(expectedWestLimit).toBe(currentWestLimit);
  });
});
