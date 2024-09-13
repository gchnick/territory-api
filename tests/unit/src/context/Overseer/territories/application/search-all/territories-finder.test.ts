import { TerritoryMother } from "@/tests/unit/src/context/Overseer/territories/domain/territory-mother";
import { MockTerritoryRepository } from "@/tests/unit/src/context/Overseer/territories/intrastructure/mock-territory-repository";
import createMockLogger from "@/tests/unit/src/context/shared/infrastructure/mock-logger";

import { TerritoriesFinder } from "@/contexts/Overseer/territories/application/search-all/territories-finder";

describe("TerritoriesFinder should", () => {
  const logger = createMockLogger();
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
