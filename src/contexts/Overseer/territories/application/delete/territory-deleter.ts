import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { TerritoryId } from "@/contexts/Overseer/territories/domain/territory-id";
import { TerritoryRepository } from "@/contexts/Overseer/territories/domain/territory-repository";

@Injectable()
export class TerritoryDeleter {
  constructor(
    private readonly logger: Logger,
    private readonly repository: TerritoryRepository,
  ) {}

  async delete(id: TerritoryId): Promise<void> {
    this.logger.log(`Deleting territory with id <${id.value}>`, "Territory");

    await this.repository.delete(id);
  }
}
