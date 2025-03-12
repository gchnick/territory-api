import { PrismaClient } from "@prisma/client/extension";

import { TerritoryPrimitives } from "@/contexts/Overseer/territories/domain/territory";
import { PrismaMapper } from "@/contexts/shared/infrastructure/persistence/prisma/repositories/prisma-mapper";

export class TerritoryMapper extends PrismaMapper<"territories"> {
  toModel(
    primitives: TerritoryPrimitives,
  ): Parameters<PrismaClient["territories"]["create"]> {
    const {
      congregationId: congregation_id,
      currentAssigned: current_assigned,
      id: territory_id,
      label,
      lastDateCompleted: last_date_completed,
      locality,
      localityInPart: locality_in_part,
      map: map_image_url,
      number,
      quantityHouses: quantity_houses,
      sector,
    } = primitives;

    return [
      {
        data: {
          congregation: {
            connect: {
              congregation_id,
            },
          },
          current_assigned,
          label,
          last_date_completed,
          locality_in_part,
          locality,
          map_image_url,
          number,
          quantity_houses,
          sector,
          territory_id,
        },
      },
    ];
  }
}
