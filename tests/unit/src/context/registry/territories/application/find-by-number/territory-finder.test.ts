/* eslint-disable simple-import-sort/imports */
import { TerritoryFinder } from "@contexts/registry/territories/application/find-by-number/territory-finder";
import { TerritoryNotFount } from "@contexts/registry/territories/domain/territory-not-fount";

import { MockLogger } from "../../../../shared/infrastructure/mock-logger";
import { TerritoryNumberMother } from "../../domain/territory-number-mother";
import { TerritoryMother } from "../../domain/territory.mother";
import { MockTerritoryRepository } from "../../intrastructure/mock-territory-repository";

describe("TerritoryFinder should", () => {
  const logger = new MockLogger();
  logger.shouldSetContext("Territory");
  const repository = new MockTerritoryRepository();
  const territoryFinder = new TerritoryFinder(logger, repository);

  it("throw territory not fount searching a non existing territory", () => {
    const territoryNumber = TerritoryNumberMother.create();

    repository.shouldNotSearch(territoryNumber);

    // eslint-disable-next-line jest/valid-expect
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
