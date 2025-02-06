import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { TerritoryId } from "@/contexts/Overseer/territories/domain/territory-id";
import { TerritoryRepository } from "@/contexts/Overseer/territories/domain/territory-repository";
import { ExistsResponse } from "@/contexts/shared/domain/exists-response";

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
