import createMockLogger from "@/tests/unit/src/context/shared/infrastructure/mock-logger";
import { UserEmailMother } from "@/tests/unit/src/context/shared/users/domain/user-email-mother";
import { UserMother } from "@/tests/unit/src/context/shared/users/domain/user-mother";
import { MockUserRepository } from "@/tests/unit/src/context/shared/users/infrastructure/mock-user-repository";

import { UserFinder } from "@/contexts/shared/users/application/find-by-email/user-finder";
import { UserNotFount } from "@/contexts/shared/users/domain/user-not-fount";

describe("UserFinder should", () => {
  const logger = createMockLogger();
  const repository = new MockUserRepository();

  const userFinder = new UserFinder(logger, repository);

  it("throw user not fount searching a non existing user", () => {
    const userEmail = UserEmailMother.create();

    repository.shouldNotSearch(userEmail);

    // eslint-disable-next-line vitest/valid-expect
    void expect(async () => {
      await userFinder.find(userEmail);
    }).rejects.toThrow(UserNotFount);
  });

  it("search an existing user", async () => {
    const existingUser = UserMother.create();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...expectedUser } = existingUser.toPrimitives();

    repository.shouldFindByEmail(existingUser);

    expect(await userFinder.find(existingUser.email)).toEqual({
      data: expectedUser,
    });
  });
});
