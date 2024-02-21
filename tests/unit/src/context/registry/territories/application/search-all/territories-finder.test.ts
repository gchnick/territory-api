import { TerritoriesFinder } from "@contexts/registry/territories/application/search-all/territories-finder";

import { MockLogger } from "../../../../shared/infrastructure/mock-logger";
import { TerritoryMother } from "../../domain/territory.mother";
import { MockTerritoryRepository } from "../../intrastructure/mock-territory-repository";

describe("TerritoriesFinder should", () => {
  const logger = new MockLogger();
  logger.shouldSetContext("Territory");
  const repository = new MockTerritoryRepository();
  const territoriesFinder = new TerritoriesFinder(logger, repository);

  it("return all existing territories", async () => {
    const territories = [TerritoryMother.create()];
    const expectedTerritories = territories.map(t => t.toPrimitives());

    repository.shouldSearchAll(territories);

    expect(await territoriesFinder.fetch()).toEqual({
      data: expectedTerritories,
    });
  });
});
