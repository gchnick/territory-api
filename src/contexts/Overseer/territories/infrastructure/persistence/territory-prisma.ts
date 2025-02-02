/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { EnviromentValueObject } from "@/contexts/shared/domain/value-object/enviroment-value-object";
import { CriteriaToPrismaConverter } from "@/contexts/shared/infrastructure/criteria/criteria-to-prisma-converter";
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

  async searchAll(): Promise<Array<Territory> | Territory> {
    const result = await this._repository.territories.findMany();

    return result.map(t =>
      Territory.fromPrimitives({
        id: t.territory_id,
        congregationId: t.congregation_id,
        currentAssigned: t.current_assigned,
        label: t.label,
        lastDateCompleted: t.last_date_completed,
        locality: t.locality,
        number: t.number,
        quantityHouses: t.quantity_houses,
        localityInPart: t.locality_in_part,
        map: t.map_image_url,
        sector: t.sector,
        meetingPlaces: [],
      }),
    );
  }

  async matching(criteria: Criteria): Promise<Array<Territory> | Territory> {
    const converter = new CriteriaToPrismaConverter();
    const prismaOptions = converter.convert([], criteria, {
      id: "territory_id",
      isAssigned: "current_assigned",
      lastCompleted: "last_date_completed",
    });

    const result = await this._repository.territories.findMany({
      ...prismaOptions,
    });

    return result.map(t =>
      Territory.fromPrimitives({
        id: t.territory_id,
        congregationId: t.congregation_id,
        currentAssigned: t.current_assigned,
        label: t.label,
        lastDateCompleted: t.last_date_completed,
        locality: t.locality,
        number: t.number,
        quantityHouses: t.quantity_houses,
        localityInPart: t.locality_in_part,
        map: t.map_image_url,
        sector: t.sector,
        meetingPlaces: [],
      }),
    );
  }

  async findByNumber(
    territoryNumber: TerritoryNumber,
  ): Promise<Nullable<Territory>> {
    const number = territoryNumber.value;
    const result = await this._repository.territories.findUnique({
      where: { number },
    });

    if (result === null) return;

    return Territory.fromPrimitives({
      id: result.territory_id,
      congregationId: result.congregation_id,
      currentAssigned: result.current_assigned,
      label: result.label,
      lastDateCompleted: result.last_date_completed,
      locality: result.locality,
      number: result.number,
      quantityHouses: result.quantity_houses,
      localityInPart: result.locality_in_part,
      map: result.map_image_url,
      sector: result.sector,
      meetingPlaces: [],
    });
  }

  async findById(id: TerritoryId): Promise<Nullable<Territory>> {
    const territory_id = id.value;
    const result = await this._repository.territories.findUnique({
      where: { territory_id },
    });

    if (result === null) return;

    return Territory.fromPrimitives({
      id: result.territory_id,
      congregationId: result.congregation_id,
      currentAssigned: result.current_assigned,
      label: result.label,
      lastDateCompleted: result.last_date_completed,
      locality: result.locality,
      number: result.number,
      quantityHouses: result.quantity_houses,
      localityInPart: result.locality_in_part,
      map: result.map_image_url,
      sector: result.sector,
      meetingPlaces: [],
    });
  }

  async update(
    id: TerritoryId,
    territory: PartialTerritoryPrimitives,
  ): Promise<void> {
    const territory_id = id.value;
    const {
      congregationId,
      currentAssigned: current_assigned,
      label,
      lastDateCompleted: last_date_completed,
      locality,
      localityInPart: locality_in_part,
      map: map_image_url,
      number,
      quantityHouses: quantity_houses,
      sector,
    } = territory;

    const data: Prisma.territoriesUpdateInput = {
      congregation: {
        connect: {
          number: congregationId,
        },
      },
      current_assigned,
      label,
      last_date_completed,
      locality,
      locality_in_part,
      map_image_url,
      number,
      quantity_houses,
      sector,
    };

    await this._repository.territories.update({
      where: { territory_id },
      data,
    });
  }

  async delete(id: TerritoryId): Promise<void> {
    const territory_id = id.value;
    await this._repository.territories.delete({
      where: { territory_id },
    });
  }

  async deleteAll(): Promise<void> {
    const nodeEnv = globalThis.process.env.NODE_ENV as string;
    const enviroment = EnviromentValueObject.fromValue(nodeEnv);

    if (!enviroment.isProduction()) {
      await this._repository.territories.deleteMany({});
    }
  }
}
