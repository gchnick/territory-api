import { faker } from "@faker-js/faker";

import {
  CardinalPoint,
  CardinalPoints,
} from "@/contexts/Overseer/congregations/domain/cardinal-points";
import { CongregationLimits } from "@/contexts/Overseer/congregations/domain/congregation-limits";

export const CongregationLimitsMother = {
  create({
    north = faker.location.streetAddress(),
    south = faker.location.streetAddress(),
    east = faker.location.streetAddress(),
    west = faker.location.streetAddress(),
  } = {}): CongregationLimits {
    return CongregationLimits.fromPrimitives([
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
  ): CongregationLimits {
    const limits: Map<CardinalPoint, string> = new Map();
    for (const { cardinalPoint, limit } of plainData)
      limits.set(
        new CardinalPoint(cardinalPoint),
        limit ?? faker.location.streetAddress(),
      );
    return new CongregationLimits(limits);
  },
};
