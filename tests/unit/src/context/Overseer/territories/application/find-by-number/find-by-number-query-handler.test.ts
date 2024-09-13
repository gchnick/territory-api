import { TerritoryMother } from "@/tests/unit/src/context/Overseer/territories/domain/territory-mother";
import { MockTerritoryRepository } from "@/tests/unit/src/context/Overseer/territories/intrastructure/mock-territory-repository";
import createMockLogger from "@/tests/unit/src/context/shared/infrastructure/mock-logger";
import { Mock } from "@/tests/utils/mock";

import { FindByNumberQueryHandler } from "@/contexts/Overseer/territories/application/find-by-number/find-by-number-query-handler";
import { TerritoryFinder } from "@/contexts/Overseer/territories/application/find-by-number/territory-finder";
import { TerritoryNotFount } from "@/contexts/Overseer/territories/domain/territory-not-fount";
import Logger from "@/contexts/shared/domain/logger";

import { FindByNumberQueryMother } from "./find-by-number-query-mother";

let logger: Mock<Logger>;
let repository: MockTerritoryRepository;
let finder: TerritoryFinder;
let handler: FindByNumberQueryHandler;

beforeEach(() => {
  logger = createMockLogger();
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
    // eslint-disable-next-line vitest/valid-expect
    void expect(async () => {
      const query = FindByNumberQueryMother.create();

      const territory = TerritoryMother.fromQuery(query);

      repository.shouldNotSearch(territory.number);

      await handler.handle(query);
    }).rejects.toThrow(TerritoryNotFount);
  });
});
