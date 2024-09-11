import { faker } from "@faker-js/faker";

import { TerritoryLimitsMother } from "./territory-limits.mother";

describe("TerritoryLimits should", () => {
  it("return limit value", () => {
    const expectedLimits = {
      north: faker.location.streetAddress(),
      south: faker.location.streetAddress(),
      east: faker.location.streetAddress(),
      west: faker.location.streetAddress(),
    };
    const limits = TerritoryLimitsMother.create({
      north: expectedLimits.north,
      south: expectedLimits.south,
      east: expectedLimits.east,
      west: expectedLimits.west,
    });

    const currentNorthLimit = limits.north;
    const currentSouthLimit = limits.south;
    const currentEastLimit = limits.east;
    const currentWestLimit = limits.west;

    expect(currentNorthLimit).toBe(expectedLimits.north);
    expect(currentSouthLimit).toBe(expectedLimits.south);
    expect(currentEastLimit).toBe(expectedLimits.east);
    expect(currentWestLimit).toBe(expectedLimits.west);
  });
});
