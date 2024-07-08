import { CreateUserCommandHandler } from "@/contexts/registry/users/application/create/create-user-command-handler";
import { UserCreator } from "@/contexts/registry/users/application/create/user-creator";
import { InvalidArgumentError } from "@/contexts/shared/domain/value-object/invalid-argument-error";

import { MockEventBus } from "../../../../shared/domain/mock-event-bus";
import { MockLogger } from "../../../../shared/infrastructure/mock-logger";
import { UserCreatedDomainEventMother } from "../../domain/user-created-domain-event-mother";
import { UserMother } from "../../domain/user-mother";
import { MockEncode } from "../../infrastructure/mock-encode";
import { MockUserRepository } from "../../infrastructure/mock-user-repository";
import { CreateUserCommandMother } from "./create-user-command-handler-mother";

let logger: MockLogger;
let repository: MockUserRepository;
let encode: MockEncode;
let creator: UserCreator;
let eventBus: MockEventBus;
let handler: CreateUserCommandHandler;

beforeEach(() => {
  logger = new MockLogger();
  repository = new MockUserRepository();
  encode = new MockEncode();
  eventBus = new MockEventBus();
  creator = new UserCreator(logger, repository, encode, eventBus);
  handler = new CreateUserCommandHandler(creator);
});

describe("CreateUserCommandHandler should", () => {
  it("create a valid user", async () => {
    const command = CreateUserCommandMother.create({
      roles: ["SERVICE_OVERSEER"],
    });
    const user = UserMother.fromCommand(command);
    const expectedUserRole = user.roles;
    const domainEvent = UserCreatedDomainEventMother.fromUser(user);

    repository.shouldFindRole(expectedUserRole[0]);
    encode.shouldHash(user.password.value);
    repository.shouldSave(user);

    await handler.handle(command);

    eventBus.shouldLastPublishedEventIs(domainEvent);
  });

  it("throw error if user role is not valid", () => {
    // eslint-disable-next-line jest/valid-expect
    void expect(async () => {
      const command = CreateUserCommandMother.invalidRoles();

      const user = UserMother.fromCommand(command);

      await handler.handle(command);

      repository.shouldSave(user);
    }).rejects.toThrow(InvalidArgumentError);
  });
});
