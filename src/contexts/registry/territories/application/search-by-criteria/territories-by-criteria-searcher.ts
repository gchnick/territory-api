import { TerritoryRepository } from "@contexts/registry/territories/domain/territory-repository";
import { Criteria } from "@contexts/shared/domain/criteria/criteria";
import { Filters } from "@contexts/shared/domain/criteria/filters";
import { Order } from "@contexts/shared/domain/criteria/order";
import Logger from "@contexts/shared/domain/logger";

import { TerritoriesRespose } from "../search-all/territories-response";

export class TerritoriesByCriteriaSearcher {
  constructor(
    private log: Logger,
    private repository: TerritoryRepository,
  ) {
    this.log.setContext("Territory");
  }

  async search(
    filters: Filters,
    order: Order,
    limit?: number,
    pointer?: string,
  ): Promise<TerritoriesRespose> {
    this.log.info(`Searching territories by criteria`);
    const criteria = new Criteria(filters, order, limit, pointer);

    const territories = await this.repository.matching(criteria);

    return new TerritoriesRespose(territories);
  }
}
