import { FindByNumberQueryHandler } from "@/contexts/registry/territories/application/find-by-number/find-by-number-query-handler";
import { TerritoryFinder } from "@/contexts/registry/territories/application/find-by-number/territory-finder";
import { TerritoryNotFount } from "@/contexts/registry/territories/domain/territory-not-fount";

import { MockLogger } from "../../../../shared/infrastructure/mock-logger";
import { TerritoryMother } from "../../domain/territory-mother";
import { MockTerritoryRepository } from "../../intrastructure/mock-territory-repository";
import { FindByNumberQueryMother } from "./find-by-number-query-mother";

let logger: MockLogger;
let repository: MockTerritoryRepository;
let finder: TerritoryFinder;
let handler: FindByNumberQueryHandler;

beforeEach(() => {
  logger = new MockLogger();
  repository = new MockTerritoryRepository();
  finder = new TerritoryFinder(logger, repository);
  handler = new FindByNumberQueryHandler(finder);
});

describe("FindByNumberQueryHandler should", () => {
  it("find an existing territory", async () => {
    const query = FindByNumberQueryMother.create();
    const territory = TerritoryMother.fromQuery(query);

    repository.shouldSearch(territory);

    await handler.handle(query);
  });

  it("throw error finding a non existing territory", () => {
    // eslint-disable-next-line jest/valid-expect
    void expect(async () => {
      const query = FindByNumberQueryMother.create();

      const territory = TerritoryMother.fromQuery(query);

      repository.shouldNotSearch(territory.number);

      await handler.handle(query);
    }).rejects.toThrow(TerritoryNotFount);
  });
});
