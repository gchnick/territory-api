import { TerritoryRepository } from "@/contexts/registry/territories/domain/territory-repository";
import { Criteria } from "@/contexts/shared/domain/criteria/criteria";
import { Filters } from "@/contexts/shared/domain/criteria/filters";
import { Order } from "@/contexts/shared/domain/criteria/order";
import Logger from "@/contexts/shared/domain/logger";
import { Injectable } from "@/contexts/shared/infrastructure/dependency-injection/injectable";

import { TerritoriesResponse } from "../search-all/territories-response";

@Injectable()
export class TerritoriesByCriteriaSearcher {
  constructor(
    private readonly logger: Logger,
    private readonly repository: TerritoryRepository,
  ) {}

  async search(
    filters: Filters,
    order: Order,
    limit?: number,
    cursor?: string,
  ): Promise<TerritoriesResponse> {
    this.logger.log(`Searching territories by criteria`, "Territory");
    const criteria = new Criteria(filters, order, limit, cursor);

    const territories = await this.repository.matching(criteria);

    return new TerritoriesResponse(territories);
  }
}
