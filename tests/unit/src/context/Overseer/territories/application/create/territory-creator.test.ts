import { TerritoryMother } from "@/tests/unit/src/context/Overseer/territories/domain/territory-mother";
import { MockTerritoryRepository } from "@/tests/unit/src/context/Overseer/territories/intrastructure/mock-territory-repository";
import { MockEventBus } from "@/tests/unit/src/context/shared/domain/mock-event-bus";
import createMockLogger from "@/tests/unit/src/context/shared/infrastructure/mock-logger";

import { TerritoryCreator } from "@/contexts/Overseer/territories/application/create/territory-creator";

describe("territory-creator should", () => {
  const logger = createMockLogger();
  const repository = new MockTerritoryRepository();
  const eventBus = new MockEventBus();

  const territoryCreator = new TerritoryCreator(logger, repository, eventBus);

  it("register a valid territory", async () => {
    const expectedTerritory = TerritoryMother.create();

    repository.shouldSave(expectedTerritory);

    await territoryCreator.create({
      id: expectedTerritory.id,
      number: expectedTerritory.number,
      label: expectedTerritory.label,
      sector: expectedTerritory.sector,
      locality: expectedTerritory.locality,
      localityInPart: expectedTerritory.localityInPart,
      quantityHouses: expectedTerritory.quantityHouses,
      lastDateCompleted: expectedTerritory.lastDateCompleted,
    });
  });
});
