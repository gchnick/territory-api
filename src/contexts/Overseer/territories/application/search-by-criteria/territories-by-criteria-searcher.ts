import { Criteria } from "@/shared/domain/criteria/criteria";
import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { TerritoryRepository } from "@/contexts/Overseer/territories/domain/territory-repository";

import { TerritoriesResponse } from "../search-all/territories-response";

@Injectable()
export class TerritoriesByCriteriaSearcher {
  constructor(
    private readonly logger: Logger,
    private readonly repository: TerritoryRepository,
  ) {}

  async search(criteria: Criteria): Promise<TerritoriesResponse> {
    this.logger.log(`Searching territories by criteria`, "Territory");
    const territories = await this.repository.matching(criteria);

    return new TerritoriesResponse(territories);
  }
}
