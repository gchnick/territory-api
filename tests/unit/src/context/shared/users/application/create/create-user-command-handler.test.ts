import { MockEventBus } from "@/tests/unit/src/context/shared/domain/mock-event-bus";
import createMockLogger from "@/tests/unit/src/context/shared/infrastructure/mock-logger";
import { UserCreatedDomainEventMother } from "@/tests/unit/src/context/shared/users/domain/user-created-domain-event-mother";
import { UserMother } from "@/tests/unit/src/context/shared/users/domain/user-mother";
import { MockEncode } from "@/tests/unit/src/context/shared/users/infrastructure/mock-encode";
import { MockUserRepository } from "@/tests/unit/src/context/shared/users/infrastructure/mock-user-repository";
import { Mock } from "@/tests/utils/mock";

import { InvalidArgumentError } from "@/shared/domain/value-object/invalid-argument-error";

import Logger from "@/contexts/shared/domain/logger";
import { CreateUserCommandHandler } from "@/contexts/shared/users/application/create/create-user-command-handler";
import { UserCreator } from "@/contexts/shared/users/application/create/user-creator";
import { Role } from "@/contexts/shared/users/domain/role/role-name";

import { CreateUserCommandMother } from "./create-user-command-handler-mother";

let logger: Mock<Logger>;
let repository: MockUserRepository;
let encode: MockEncode;
let creator: UserCreator;
let eventBus: MockEventBus;
let handler: CreateUserCommandHandler;

beforeEach(() => {
  logger = createMockLogger();
  repository = new MockUserRepository();
  encode = new MockEncode();
  eventBus = new MockEventBus();
  creator = new UserCreator(logger, repository, encode, eventBus);
  handler = new CreateUserCommandHandler(creator);
});

describe("CreateUserCommandHandler should", () => {
  it("create a valid user", async () => {
    const command = CreateUserCommandMother.create({
      roles: [Role.SERVICE_OVERSEER],
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
    // eslint-disable-next-line vitest/valid-expect
    void expect(async () => {
      const command = CreateUserCommandMother.invalidRoles();

      const user = UserMother.fromCommand(command);

      await handler.handle(command);

      repository.shouldSave(user);
    }).rejects.toThrow(InvalidArgumentError);
  });
});
