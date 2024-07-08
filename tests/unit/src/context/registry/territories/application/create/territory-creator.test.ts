import { TerritoryCreator } from "@/contexts/registry/territories/application/create/territory-creator";

import { MockEventBus } from "../../../../shared/domain/mock-event-bus";
import { MockLogger } from "../../../../shared/infrastructure/mock-logger";
import { TerritoryMother } from "../../domain/territory-mother";
import { MockTerritoryRepository } from "../../intrastructure/mock-territory-repository";

describe("territory-creator should", () => {
  const logger = new MockLogger();
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
