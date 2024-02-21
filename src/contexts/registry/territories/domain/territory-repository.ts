import { Criteria } from "@contexts/shared/domain/criteria/criteria";
import { Nullable } from "@contexts/shared/domain/nullable";

import { Territory, TerritoryPrimitives } from "./territory";
import { TerritoryId } from "./territory-id";
import { TerritoryNumber } from "./territory-number";

export abstract class TerritoryRepository {
  abstract save(territory: Territory): Promise<void>;

  abstract searchAll(): Promise<Array<Territory>>;

  abstract matching(criteria: Criteria): Promise<Array<Territory>>;

  abstract findByNumber(number: TerritoryNumber): Promise<Nullable<Territory>>;

  abstract findById(id: TerritoryId): Promise<Nullable<Territory>>;

  abstract update(
    number: TerritoryNumber,
    data: Partial<TerritoryPrimitives>,
  ): Promise<Territory>;

  abstract delete(id: TerritoryId): Promise<void>;

  protected abstract truncate(): Promise<void>;

  async deleteAll(): Promise<void> {
    const NODE_ENV = process.env.NODE_ENV;
    if (NODE_ENV === "development" || NODE_ENV === "test") {
      await this.truncate();
    }
  }
}
