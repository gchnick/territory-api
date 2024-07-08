import Logger from "@/contexts/shared/domain/logger";
import { Injectable } from "@/contexts/shared/infrastructure/dependency-injection/injectable";

import { TerritoryId } from "../../domain/territory-id";
import { TerritoryRepository } from "../../domain/territory-repository";

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
