import { Prisma } from "@prisma/client";

import { Territory } from "@/contexts/Overseer/territories/domain/territory";
import { TerritoryId } from "@/contexts/Overseer/territories/domain/territory-id";
import { TerritoryNumber } from "@/contexts/Overseer/territories/domain/territory-number";
import {
  PartialTerritoryPrimitives,
  TerritoryRepository,
} from "@/contexts/Overseer/territories/domain/territory-repository";
import { Criteria } from "@/contexts/shared/domain/criteria/criteria";
import { Nullable } from "@/contexts/shared/domain/nullable";
import { NestPrismaService } from "@/contexts/shared/infrastructure/persistence/prisma/nest-prisma-service";

export class TerritoryPrisma implements TerritoryRepository {
  constructor(private readonly _repository: NestPrismaService) {}

  async save(territory: Territory): Promise<void> {
    const {
      id: territory_id,
      congregationId,
      number,
      label,
      locality,
      localityInPart: locality_in_part,
      quantityHouses: quantity_houses,
      sector,
      lastDateCompleted: last_date_completed,
      currentAssigned: current_assigned,
      map: map_image_url,
    } = territory.toPrimitives();

    const data: Prisma.territoriesCreateInput = {
      congregation: {
        connect: {
          number: congregationId,
        },
      },
      territory_id,
      label,
      last_date_completed,
      locality,
      locality_in_part,
      number,
      current_assigned,
      map_image_url,
      quantity_houses,
      sector,
    };

    await this._repository.territories.create({ data });
  }
  searchAll(): Promise<Array<Territory> | Territory> {
    throw new Error("Method not implemented.");
  }
  matching(criteria: Criteria): Promise<Array<Territory> | Territory> {
    throw new Error("Method not implemented.");
  }
  findByNumber(number: TerritoryNumber): Promise<Nullable<Territory>> {
    throw new Error("Method not implemented.");
  }
  findById(id: TerritoryId): Promise<Nullable<Territory>> {
    throw new Error("Method not implemented.");
  }
  update(id: TerritoryId, data: PartialTerritoryPrimitives): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: TerritoryId): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteAll(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
