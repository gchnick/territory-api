import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { TerritoryRepository } from "@/contexts/Overseer/territories/domain/territory-repository";

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
