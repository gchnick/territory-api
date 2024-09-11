import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { ExistsResponse } from "../../../../shared/domain/exists-response";
import { TerritoryId } from "../../domain/territory-id";
import { TerritoryRepository } from "../../domain/territory-repository";

@Injectable()
export class TerritoryQuestioner {
  constructor(
    private readonly logger: Logger,
    private readonly territoryRepository: TerritoryRepository,
  ) {}

  async ask(id: TerritoryId): Promise<ExistsResponse> {
    this.logger.log(
      `Finding if territory by id <${id.value}> exists`,
      "Territory",
    );
    const territory = await this.territoryRepository.findById(id);

    return territory ? new ExistsResponse(true) : new ExistsResponse(false);
  }
}
