import { MockEventBus } from "@/tests/unit/src/context/shared/domain/mock-event-bus";
import createMockLogger from "@/tests/unit/src/context/shared/infrastructure/mock-logger";
import { RoleNameMother } from "@/tests/unit/src/context/shared/users/domain/role/role-name-mother";
import { UserMother } from "@/tests/unit/src/context/shared/users/domain/user-mother";
import { UserRoleMother } from "@/tests/unit/src/context/shared/users/domain/user-role-mother";
import { MockEncode } from "@/tests/unit/src/context/shared/users/infrastructure/mock-encode";
import { MockUserRepository } from "@/tests/unit/src/context/shared/users/infrastructure/mock-user-repository";

import { UserCreator } from "@/contexts/shared/users/application/create/user-creator";
import { Role } from "@/contexts/shared/users/domain/role/role-name";

describe("UserCreator should", () => {
  const logger = createMockLogger();
  const repository = new MockUserRepository();
  const encode = new MockEncode();
  const eventBus = new MockEventBus();

  const userCreator = new UserCreator(logger, repository, encode, eventBus);

  it("register a valid user", async () => {
    const role = Role.SERVICE_OVERSEER;
    const expectedRoleName = RoleNameMother.create(role);
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
