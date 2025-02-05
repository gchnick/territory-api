import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { CongregationId } from "@/contexts/Overseer/congregations/domain/congregation-id";
import { Territory } from "@/contexts/Overseer/territories/domain/territory";
import { TerritoryId } from "@/contexts/Overseer/territories/domain/territory-id";
import { TerritoryNumber } from "@/contexts/Overseer/territories/domain/territory-number";
import { TerritoryNumberAlreadyRegistry } from "@/contexts/Overseer/territories/domain/territory-number-already-registry";
import {
  PartialTerritoryPrimitives,
  TerritoryRepository,
} from "@/contexts/Overseer/territories/domain/territory-repository";
import { Criteria } from "@/contexts/shared/domain/criteria/criteria";
import { Nullable } from "@/contexts/shared/domain/nullable";
import { EnviromentValueObject } from "@/contexts/shared/domain/value-object/enviroment-value-object";
import {
  BooleanCasting,
  CriteriaToPrismaConverter,
} from "@/contexts/shared/infrastructure/criteria/criteria-to-prisma-converter";
import { NestPrismaService } from "@/contexts/shared/infrastructure/persistence/prisma/nest-prisma-service";

export class TerritoryPrisma implements TerritoryRepository {
  constructor(private readonly _repository: NestPrismaService) {}

  async save(territory: Territory): Promise<void> {
    const {
      id: territory_id,
      congregationId: congregation_id,
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

    try {
      await this._repository.territories.create({
        data: {
          congregation: {
            connect: {
              congregation_id,
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
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new TerritoryNumberAlreadyRegistry();
      }
    }
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
        localityInPart: t.locality_in_part ?? undefined,
        map: t.map_image_url ?? undefined,
        sector: t.sector ?? undefined,
        meetingPlaces: [],
      }),
    );
  }

  async matching(criteria: Criteria): Promise<Array<Territory> | Territory> {
    const converter = new CriteriaToPrismaConverter();
    const prismaOptions = converter.convert(
      criteria,
      {
        id: "territory_id",
        congregation: "congregation_id",
        isAssigned: "current_assigned",
        lastCompleted: "last_date_completed",
      },
      { congregation: Number, isAssigned: BooleanCasting },
    );

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
        localityInPart: t.locality_in_part ?? undefined,
        map: t.map_image_url ?? undefined,
        sector: t.sector ?? undefined,
        meetingPlaces: [],
      }),
    );
  }

  async findByNumber(
    congregationId: CongregationId,
    territoryNumber: TerritoryNumber,
  ): Promise<Nullable<Territory>> {
    const congregation_id = congregationId.value;
    const number = territoryNumber.value;
    const result = await this._repository.territories.findUnique({
      where: { congregation_id_number: { congregation_id, number } },
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
      localityInPart: result.locality_in_part ?? undefined,
      map: result.map_image_url ?? undefined,
      sector: result.sector ?? undefined,
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
      localityInPart: result.locality_in_part ?? undefined,
      map: result.map_image_url ?? undefined,
      sector: result.sector ?? undefined,
      meetingPlaces: [],
    });
  }

  async update(
    id: TerritoryId,
    congregationId: CongregationId,
    territory: PartialTerritoryPrimitives,
  ): Promise<void> {
    const congregation_id = congregationId.value;
    const territory_id = id.value;
    const {
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

    const data: Prisma.TerritoriesUpdateInput = {
      congregation: {
        connect: {
          congregation_id,
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
