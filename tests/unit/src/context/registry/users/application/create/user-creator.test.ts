import { UserCreator } from "@/contexts/registry/users/application/create/user-creator";

import { MockEventBus } from "../../../../shared/domain/mock-event-bus";
import { MockLogger } from "../../../../shared/infrastructure/mock-logger";
import { RoleNameMother } from "../../domain/role/role-name-mother";
import { UserMother } from "../../domain/user-mother";
import { UserRoleMother } from "../../domain/user-role-mother";
import { MockEncode } from "../../infrastructure/mock-encode";
import { MockUserRepository } from "../../infrastructure/mock-user-repository";

describe("UserCreator should", () => {
  const logger = new MockLogger();
  const repository = new MockUserRepository();
  const encode = new MockEncode();
  const eventBus = new MockEventBus();

  const userCreator = new UserCreator(logger, repository, encode, eventBus);

  it("register a valid user", async () => {
    const expectedRoleName = RoleNameMother.create("SERVICE_OVERSEER");
    const expectedUserRole = UserRoleMother.create({
      name: expectedRoleName.value,
    });
    const expectedUser = UserMother.create({
      verified: false,
      roles: [expectedUserRole.toPrimitives()],
    });

    encode.shouldHash(expectedUser.password.value);
    repository.shouldFindRole(expectedUserRole);
    repository.shouldSave(expectedUser);

    await userCreator.create({
      id: expectedUser.id,
      name: expectedUser.name,
      email: expectedUser.email,
      password: expectedUser.password,
      roles: [expectedRoleName],
    });
  });
});
