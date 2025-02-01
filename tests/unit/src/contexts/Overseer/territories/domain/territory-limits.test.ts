import { faker } from "@faker-js/faker";

import {
  CardinalPoint,
  CardinalPoints,
} from "@/contexts/Overseer/territories/domain/cardinal-points";
import { TerritoryLimits } from "@/contexts/Overseer/territories/domain/territory-limits";
import { InvalidArgumentError } from "@/contexts/shared/domain/value-object/invalid-argument-error";

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

    const currentNorthLimit = limits.get(CardinalPoint.fromValue("NORTH"));
    const currentSouthLimit = limits.get(CardinalPoint.fromValue("SOUTH"));
    const currentEastLimit = limits.get(CardinalPoint.fromValue("EAST"));
    const currentWestLimit = limits.get(CardinalPoint.fromValue("WEST"));

    expect(currentNorthLimit).toBe(expectedLimits.north);
    expect(currentSouthLimit).toBe(expectedLimits.south);
    expect(currentEastLimit).toBe(expectedLimits.east);
    expect(currentWestLimit).toBe(expectedLimits.west);
  });

  it("throw error when cardinal point repeat in constructor instance", () => {
    const limitsWithRepeatCardinalPoint = TerritoryLimitsMother.create().values;
    limitsWithRepeatCardinalPoint.set(
      CardinalPoint.fromValue("NORTH"),
      "Direction faker",
    );

    const repeatInstance = () => {
      new TerritoryLimits(limitsWithRepeatCardinalPoint);
    };

    expect(repeatInstance).toThrow(InvalidArgumentError);
  });

  it("return undefine when cardinal point not fount", () => {
    const limitsWithoutNorth = TerritoryLimitsMother.with([
      { cardinalPoint: CardinalPoints.SOUTH },
      { cardinalPoint: CardinalPoints.EAST },
      { cardinalPoint: CardinalPoints.WEST },
    ]);

    const limitExpected = limitsWithoutNorth.get(
      CardinalPoint.fromValue("NORTH"),
    );

    expect(limitExpected).toBeUndefined();
  });

  it("return primitive fields", () => {
    const expectPrimitive = [
      {
        cardinalPoint: "NORTH",
        limit: "49543 Kuvalis Overpass",
      },
    ];

    const limits = TerritoryLimitsMother.with([
      {
        cardinalPoint: CardinalPoints.NORTH,
        limit: "49543 Kuvalis Overpass",
      },
    ]);
    const primitive = limits.toPrimitives();

    expect(expectPrimitive).toEqual(primitive);
  });
});
