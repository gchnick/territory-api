import Logger from "@contexts/shared/domain/logger";

import { TerritoryId } from "../../domain/territory-id";
import { TerritoryRepository } from "../../domain/territory-repository";

export class TerritoryDeleter {
  constructor(
    private log: Logger,
    private repository: TerritoryRepository,
  ) {
    this.log.setContext("Territory");
  }

  async delete(id: TerritoryId): Promise<void> {
    this.log.info(`Deleting territory with id <${id.value}>`);

    await this.repository.delete(id);
  }
}
