import { Criteria } from "@/contexts/shared/domain/criteria/criteria";
import { DeepPartial } from "@/contexts/shared/domain/deep-partial";
import { Nullable } from "@/contexts/shared/domain/nullable";

import { Territory } from "./territory";
import { TerritoryId } from "./territory-id";
import { TerritoryNumber } from "./territory-number";

export abstract class TerritoryRepository {
  abstract save(territory: Territory): Promise<void>;

  abstract searchAll(): Promise<Array<Territory> | Territory>;

  abstract matching(criteria: Criteria): Promise<Array<Territory> | Territory>;

  abstract findByNumber(number: TerritoryNumber): Promise<Nullable<Territory>>;

  abstract findById(id: TerritoryId): Promise<Nullable<Territory>>;

  abstract update(id: TerritoryId, data: DeepPartial<Territory>): Promise<void>;

  abstract update(id: TerritoryId, data: Territory): Promise<void>;

  abstract delete(id: TerritoryId): Promise<void>;

  abstract deleteAll(): Promise<void>;
}
