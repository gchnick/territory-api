/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserFinder } from "@/contexts/registry/users/application/find-by-email/user-finder";
import { UserNotFount } from "@/contexts/registry/users/domain/user-not-fount";

import { MockLogger } from "../../../../shared/infrastructure/mock-logger";
import { UserEmailMother } from "../../domain/user-email-mother";
import { UserMother } from "../../domain/user-mother";
import { MockUserRepository } from "../../infrastructure/mock-user-repository";

describe("UserFinder should", () => {
  const logger = new MockLogger();
  const repository = new MockUserRepository();

  const userFinder = new UserFinder(logger, repository);

  it("throw user not fount searching a non existing user", () => {
    const userEmail = UserEmailMother.create();

    repository.shouldNotSearch(userEmail);

    // eslint-disable-next-line jest/valid-expect
    void expect(async () => {
      await userFinder.find(userEmail);
    }).rejects.toThrow(UserNotFount);
  });

  it("search an existing user", async () => {
    const existingUser = UserMother.create();
    const { password, ...expectedUser } = existingUser.toPrimitives();

    repository.shouldFindByEmail(existingUser);

    expect(await userFinder.find(existingUser.email)).toEqual({
      data: expectedUser,
    });
  });
});
