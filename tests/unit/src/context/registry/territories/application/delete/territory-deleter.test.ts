import { TerritoryDeleter } from "@/contexts/registry/territories/application/delete/territory-deleter";

import { MockLogger } from "../../../../shared/infrastructure/mock-logger";
import { TerritoryIdMother } from "../../domain/territory-id-mother";
import { MockTerritoryRepository } from "../../intrastructure/mock-territory-repository";

describe("territory-deleter should", () => {
  const logger = new MockLogger();
  const repository = new MockTerritoryRepository();
  const territoryDeleter = new TerritoryDeleter(logger, repository);

  it("delete a territory", async () => {
    const territoryId = TerritoryIdMother.create();

    repository.shouldDelete(territoryId);

    await territoryDeleter.delete(territoryId);
  });
});
