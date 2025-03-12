import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { Prisma } from "@/db/client/external";

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
import {
  BooleanCasting,
  CriteriaToPrismaConverter,
} from "@/contexts/shared/infrastructure/criteria/criteria-to-prisma-converter";
import { ExternalPrismaRepository } from "@/contexts/shared/infrastructure/persistence/prisma/repositories/external-prisma-repository";

import { TerritoryMapper } from "./territory-mapper";

type TerritoryWithMeetingPlaces = Prisma.TerritoriesGetPayload<{
  include: { meeting_place: true };
}>;

export class TerritoryPrisma
  extends ExternalPrismaRepository<Territory, "territories">
  implements TerritoryRepository
{
  async save(territory: Territory): Promise<void> {
    const territoryMapper = new TerritoryMapper();
    try {
      await this.persist(territory, territoryMapper);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new TerritoryNumberAlreadyRegistry();
      }
    }
  }

  async searchAll(): Promise<Territory[] | Territory> {
    const result = await this.repository().findMany({
      include: { meeting_place: true },
    });
    return result.map(t => this.#toDomain(t));
  }

  async matching(criteria: Criteria): Promise<Territory[] | Territory> {
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

    const result = await this.repository().findMany({
      ...prismaOptions,
      include: { meeting_place: true },
    });

    return result.map(t => this.#toDomain(t));
  }

  async findByNumber(
    congregationId: CongregationId,
    territoryNumber: TerritoryNumber,
  ): Promise<Nullable<Territory>> {
    const congregation_id = congregationId.value;
    const number = territoryNumber.value;
    const result = await this.repository().findUnique({
      where: { congregation_id_number: { congregation_id, number } },
      include: { meeting_place: true },
    });

    if (result === null) return;

    return this.#toDomain(result);
  }

  async findById(id: TerritoryId): Promise<Nullable<Territory>> {
    const territory_id = id.value;
    const result = await this.repository().findUnique({
      where: { territory_id },
      include: { meeting_place: true },
    });

    if (result === null) return;

    return this.#toDomain(result);
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

    await this.repository().update({
      where: { territory_id },
      data,
    });
  }

  async delete(id: TerritoryId): Promise<void> {
    const territory_id = id.value;
    await this.repository().delete({
      where: { territory_id },
    });
  }

  async deleteAll(): Promise<void> {
    await this.truncate();
  }

  #toDomain(territory: TerritoryWithMeetingPlaces): Territory {
    return Territory.fromPrimitives({
      congregationId: territory.congregation_id,
      currentAssigned: territory.current_assigned,
      id: territory.territory_id,
      label: territory.label,
      lastDateCompleted: territory.last_date_completed
        .toISOString()
        .split("T")[0],
      locality: territory.locality,
      localityInPart: territory.locality_in_part ?? undefined,
      map: territory.map_image_url ?? undefined,
      meetingPlaces: territory.meeting_place.map(mp => ({
        id: mp.meeting_place_id,
        address: mp.address,
        latitude: mp.latitude ?? undefined,
        longitude: mp.longitude ?? undefined,
        publisherLiving: mp.meeting_place_id,
      })),
      number: territory.number,
      quantityHouses: territory.quantity_houses,
      sector: territory.sector ?? undefined,
    });
  }
}
