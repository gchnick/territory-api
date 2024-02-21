import { TerritoryNotFount } from "@contexts/registry/territories/domain/territory-not-fount";
import { TerritoryNumber } from "@contexts/registry/territories/domain/territory-number";
import { TerritoryRepository } from "@contexts/registry/territories/domain/territory-repository";
import Logger from "@contexts/shared/domain/logger";

import { TerritoryResponse } from "./territory-response";

export class TerritoryFinder {
  constructor(
    private log: Logger,
    private territoryRepository: TerritoryRepository,
  ) {
    this.log.setContext("Territory");
  }

  async find(number: TerritoryNumber): Promise<TerritoryResponse> {
    this.log.info(`Finding territory by number <${number.value}>`);
    const territory = await this.territoryRepository.findByNumber(number);

    if (!territory) {
      throw new TerritoryNotFount(
        `Territory with number <${number.value}> not found`,
      );
    }

    return new TerritoryResponse(territory);
  }
}
