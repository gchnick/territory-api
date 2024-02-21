/* eslint-disable @typescript-eslint/no-unused-vars */
import { Criteria } from "@contexts/shared/domain/criteria/criteria";
import { Nullable } from "@contexts/shared/domain/nullable";

import { Territory, TerritoryPrimitives } from "../../../domain/territory";
import { TerritoryId } from "../../../domain/territory-id";
import { TerritoryNumber } from "../../../domain/territory-number";
import { TerritoryRepository } from "../../../domain/territory-repository";

export class TerritoryTypeorm extends TerritoryRepository {
  save(territory: Territory): Promise<void> {
    throw new Error("Method not implemented.");
  }
  searchAll(): Promise<Territory[]> {
    throw new Error("Method not implemented.");
  }
  matching(criteria: Criteria): Promise<Territory[]> {
    throw new Error("Method not implemented.");
  }
  findByNumber(number: TerritoryNumber): Promise<Nullable<Territory>> {
    throw new Error("Method not implemented.");
  }
  findById(id: TerritoryId): Promise<Nullable<Territory>> {
    throw new Error("Method not implemented.");
  }
  update(
    number: TerritoryNumber,
    data: Partial<TerritoryPrimitives>,
  ): Promise<Territory> {
    throw new Error("Method not implemented.");
  }
  delete(id: TerritoryId): Promise<void> {
    throw new Error("Method not implemented.");
  }
  protected truncate(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
