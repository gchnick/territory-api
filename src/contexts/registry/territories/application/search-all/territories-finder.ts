import { TerritoryRepository } from "@contexts/registry/territories/domain/territory-repository";
import Logger from "@contexts/shared/domain/logger";

import { TerritoriesRespose } from "./territories-response";

export class TerritoriesFinder {
  constructor(
    private log: Logger,
    private territoryRepository: TerritoryRepository,
  ) {
    this.log.setContext("Territory");
  }

  async fetch() {
    this.log.info(`Fetching all territories`);
    const territories = await this.territoryRepository.searchAll();

    return new TerritoriesRespose(territories);
  }
}
