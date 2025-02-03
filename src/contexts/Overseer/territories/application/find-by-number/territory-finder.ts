import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { CongregationId } from "@/contexts/Overseer/congregations/domain/congregation-id";
import { TerritoryNotFount } from "@/contexts/Overseer/territories/domain/territory-not-fount";
import { TerritoryNumber } from "@/contexts/Overseer/territories/domain/territory-number";
import { TerritoryRepository } from "@/contexts/Overseer/territories/domain/territory-repository";

import { TerritoryResponse } from "./territory-response";

@Injectable()
export class TerritoryFinder {
  constructor(
    private readonly logger: Logger,
    private readonly territoryRepository: TerritoryRepository,
  ) {}

  async find(
    congregationId: CongregationId,
    number: TerritoryNumber,
  ): Promise<TerritoryResponse> {
    this.logger.log(
      `Finding territory by number <${number.value}> and congregation <${congregationId.value}>`,
      "Territory",
    );
    const territory = await this.territoryRepository.findByNumber(
      congregationId,
      number,
    );

    if (!territory) {
      throw new TerritoryNotFount(
        `Territory with number <${number.value}> of the congregation <${congregationId.value}> not found`,
      );
    }

    return new TerritoryResponse(territory);
  }
}
