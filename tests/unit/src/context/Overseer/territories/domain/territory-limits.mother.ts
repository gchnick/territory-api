import { faker } from "@faker-js/faker";

import {
  CardinalPoint,
  CardinalPoints,
} from "@/contexts/Overseer/territories/domain/cardinal-points";
import { TerritoryLimits } from "@/contexts/Overseer/territories/domain/territory-limits";

export const TerritoryLimitsMother = {
  create({
    north = faker.location.streetAddress(),
    south = faker.location.streetAddress(),
    east = faker.location.streetAddress(),
    west = faker.location.streetAddress(),
  } = {}): TerritoryLimits {
    return TerritoryLimits.fromPrimitives([
      { cardinalPoint: "NORTH", limit: north },
      { cardinalPoint: "SOUTH", limit: south },
      { cardinalPoint: "EAST", limit: east },
      { cardinalPoint: "WEST", limit: west },
    ]);
  },
  with(
    plainData: {
      cardinalPoint: CardinalPoints;
      limit?: string;
    }[],
  ): TerritoryLimits {
    const limits: Map<CardinalPoint, string> = new Map();
    for (const { cardinalPoint, limit } of plainData)
      limits.set(
        new CardinalPoint(cardinalPoint),
        limit ?? faker.location.streetAddress(),
      );
    return new TerritoryLimits(limits);
  },
};
