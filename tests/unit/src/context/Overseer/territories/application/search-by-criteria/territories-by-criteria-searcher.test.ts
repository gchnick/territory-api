import { TerritoriesByCriteriaSearcher } from "@/contexts/Overseer/territories/application/search-by-criteria/territories-by-criteria-searcher";

import { CriteriaMother } from "../../../../shared/domain/criteria/criteria-mother";
import { MockLogger } from "../../../../shared/infrastructure/mock-logger";
import { TerritoryMother } from "../../domain/territory-mother";
import { MockTerritoryRepository } from "../../intrastructure/mock-territory-repository";

describe("territories-by-criteria-searcher should", () => {
  const logger = new MockLogger();
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

    // eslint-disable-next-line jest/valid-expect
    void expect(
      await territoriesByCriteriaSearcher.search(
        criteria.filters,
        criteria.order,
      ),
    ).toEqual({ data: expectedTerritories });
  });
});
