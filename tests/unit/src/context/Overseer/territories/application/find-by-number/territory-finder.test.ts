import { TerritoryMother } from "@/tests/unit/src/context/Overseer/territories/domain/territory-mother";
import { TerritoryNumberMother } from "@/tests/unit/src/context/Overseer/territories/domain/territory-number-mother";
import { MockTerritoryRepository } from "@/tests/unit/src/context/Overseer/territories/intrastructure/mock-territory-repository";
import createMockLogger from "@/tests/unit/src/context/shared/infrastructure/mock-logger";

import { TerritoryFinder } from "@/contexts/Overseer/territories/application/find-by-number/territory-finder";
import { TerritoryNotFount } from "@/contexts/Overseer/territories/domain/territory-not-fount";

describe("TerritoryFinder should", () => {
  const logger = createMockLogger();
  const repository = new MockTerritoryRepository();
  const territoryFinder = new TerritoryFinder(logger, repository);

  it("throw territory not fount searching a non existing territory", () => {
    const territoryNumber = TerritoryNumberMother.create();

    repository.shouldNotSearch(territoryNumber);

    // eslint-disable-next-line vitest/valid-expect
    void expect(async () => {
      await territoryFinder.find(territoryNumber);
    }).rejects.toThrow(TerritoryNotFount);
  });

  it("search an existing territory", async () => {
    const existingTerritory = TerritoryMother.create();
    const expectedTerritory = existingTerritory.toPrimitives();

    repository.shouldSearch(existingTerritory);

    expect(await territoryFinder.find(existingTerritory.number)).toEqual({
      data: expectedTerritory,
    });
  });
});
