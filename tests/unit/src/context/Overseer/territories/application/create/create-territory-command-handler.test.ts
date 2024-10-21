import { createMock, Mock } from "@/tests/utils/mock";

import Logger from "@/shared/domain/logger";

import { CreateTerritoryCommandHandler } from "@/contexts/Overseer/territories/application/create/create-territory-command-handler";
import { TerritoryCreator } from "@/contexts/Overseer/territories/application/create/territory-creator";
import { TerritoryLabelLengthExceeded } from "@/contexts/Overseer/territories/domain/territory-label-length-exceeded";

import { MockEventBus } from "../../../../shared/domain/mock-event-bus";
import { TerritoryCreatedDomainEventMother } from "../../domain/territory-created-domain-event-mother";
import { TerritoryMother } from "../../domain/territory-mother";
import { MockTerritoryRepository } from "../../intrastructure/mock-territory-repository";
import { CreateTerritoryCommandMother } from "./create-territory-command-mother";

let logger: Mock<Logger>;
let repository: MockTerritoryRepository;
let creator: TerritoryCreator;
let eventBus: MockEventBus;
let handler: CreateTerritoryCommandHandler;

beforeEach(() => {
  logger = createMock<Logger>();
  repository = new MockTerritoryRepository();
  eventBus = new MockEventBus();
  creator = new TerritoryCreator(logger, repository, eventBus);
  handler = new CreateTerritoryCommandHandler(creator);
});

describe("CreateTerritoryCommandHandler should", () => {
  it("create a valid territory", async () => {
    const command = CreateTerritoryCommandMother.create();
    const territory = TerritoryMother.fromCommand(command);
    const domainEvent =
      TerritoryCreatedDomainEventMother.fromTerritory(territory);

    await handler.handle(command);

    repository.shouldSave(territory);
    eventBus.shouldLastPublishedEventIs(domainEvent);
  });

  it("throw error if territory label length is exceeded", () => {
    // eslint-disable-next-line jest/valid-expect
    void expect(async () => {
      const command = CreateTerritoryCommandMother.invalidLabel();

      const territory = TerritoryMother.fromCommand(command);

      await handler.handle(command);

      repository.shouldSave(territory);
    }).rejects.toThrow(TerritoryLabelLengthExceeded);
  });
});