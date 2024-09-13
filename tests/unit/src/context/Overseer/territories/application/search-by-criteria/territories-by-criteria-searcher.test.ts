import { TerritoryMother } from "@/tests/unit/src/context/Overseer/territories/domain/territory-mother";
import { MockTerritoryRepository } from "@/tests/unit/src/context/Overseer/territories/intrastructure/mock-territory-repository";
import { CriteriaMother } from "@/tests/unit/src/context/shared/domain/criteria/criteria-mother";
import createMockLogger from "@/tests/unit/src/context/shared/infrastructure/mock-logger";

import { TerritoriesByCriteriaSearcher } from "@/contexts/Overseer/territories/application/search-by-criteria/territories-by-criteria-searcher";

describe("territories-by-criteria-searcher should", () => {
  const logger = createMockLogger();
  const repository = new MockTerritoryRepository();
  const territoriesByCriteriaSearcher = new TerritoriesByCriteriaSearcher(
    logger,
    repository,
  );

  it("search territories using a criteria", async () => {
    const criteria = CriteriaMother.create({
      filters: [{ field: "isLocked", operator: "EQUAL", value: "false" }],
    });
    const territories = [TerritoryMother.create()];
    const expectedTerritories = territories.map(t => t.toPrimitives());

    repository.shouldMatch(criteria, territories);

    void expect(
      await territoriesByCriteriaSearcher.search(
        criteria.filters,
        criteria.order,
      ),
    ).toEqual({ data: expectedTerritories });
  });
});
