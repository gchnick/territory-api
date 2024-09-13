import { TerritoryIdMother } from "@/tests/unit/src/context/Overseer/territories/domain/territory-id-mother";
import { MockTerritoryRepository } from "@/tests/unit/src/context/Overseer/territories/intrastructure/mock-territory-repository";
import createMockLogger from "@/tests/unit/src/context/shared/infrastructure/mock-logger";

import { TerritoryDeleter } from "@/contexts/Overseer/territories/application/delete/territory-deleter";

describe("territory-deleter should", () => {
  const logger = createMockLogger();
  const repository = new MockTerritoryRepository();
  const territoryDeleter = new TerritoryDeleter(logger, repository);

  it("delete a territory", async () => {
    const territoryId = TerritoryIdMother.create();

    repository.shouldDelete(territoryId);

    await territoryDeleter.delete(territoryId);
  });
});
