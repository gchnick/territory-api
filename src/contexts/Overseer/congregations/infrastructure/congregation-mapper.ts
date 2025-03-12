import { PrismaClient } from "@/db/client/external";

import { PrismaMapper } from "@/contexts/shared/infrastructure/persistence/prisma/repositories/prisma-mapper";

import { CardinalPoint } from "../domain/cardinal-points";
import { CongregationPrimitives } from "../domain/congregation";
import { CongregationLimits } from "../domain/congregation-limits";

export class CongregationMapper extends PrismaMapper<"congregations"> {
  toModel(
    primitives: CongregationPrimitives,
  ): Parameters<PrismaClient["congregations"]["create"]> {
    const {
      circuit,
      limits: limitsPrimitives,
      map: map_image_url,
      name,
      number: congregation_id,
      numberOfTerritories: number_of_territories,
    } = primitives;

    const limits = CongregationLimits.fromPrimitives(limitsPrimitives);
    const east_limit = limits.getOrThrow(CardinalPoint.fromValue("EAST"));
    const north_limit = limits.getOrThrow(CardinalPoint.fromValue("NORTH"));
    const south_limit = limits.getOrThrow(CardinalPoint.fromValue("SOUTH"));
    const west_limit = limits.getOrThrow(CardinalPoint.fromValue("WEST"));

    return [
      {
        data: {
          circuit,
          congregation_id,
          east_limit,
          map_image_url,
          name,
          north_limit,
          number_of_territories,
          south_limit,
          west_limit,
        },
      },
    ];
  }
}
