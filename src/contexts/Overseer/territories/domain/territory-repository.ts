import { Criteria } from "@/shared/domain/criteria/criteria";
import { Nullable } from "@/shared/domain/nullable";

import { Territory, TerritoryPrimitives } from "./territory";
import { TerritoryId } from "./territory-id";
import { TerritoryNumber } from "./territory-number";

export type PartialTerritoryPrimitives = Partial<
  Omit<TerritoryPrimitives, "id" | "meetingPlaces" | "congregationId">
>;

export abstract class TerritoryRepository {
  abstract save(territory: Territory): Promise<void>;

  abstract searchAll(): Promise<Array<Territory> | Territory>;

  abstract matching(criteria: Criteria): Promise<Array<Territory> | Territory>;

  abstract findByNumber(number: TerritoryNumber): Promise<Nullable<Territory>>;

  abstract findById(id: TerritoryId): Promise<Nullable<Territory>>;

  abstract update(
    id: TerritoryId,
    data: PartialTerritoryPrimitives,
  ): Promise<void>;

  abstract delete(id: TerritoryId): Promise<void>;

  abstract deleteAll(): Promise<void>;
}
