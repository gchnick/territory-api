import { TerritoryRepository } from "@/contexts/registry/territories/domain/territory-repository";
import Logger from "@/contexts/shared/domain/logger";
import { Injectable } from "@/contexts/shared/infrastructure/dependency-injection/injectable";

import { TerritoriesResponse } from "./territories-response";

@Injectable()
export class TerritoriesFinder {
  constructor(
    private readonly logger: Logger,
    private readonly territoryRepository: TerritoryRepository,
  ) {}

  async fetch() {
    this.logger.log(`Fetching all territories`, "Territory");
    const territories = await this.territoryRepository.searchAll();

    return new TerritoriesResponse(territories);
  }
}
