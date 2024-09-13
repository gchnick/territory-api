import createMockLogger from "@/tests/unit/src/context/shared/infrastructure/mock-logger";
import { UserMother } from "@/tests/unit/src/context/shared/users/domain/user-mother";
import { MockUserRepository } from "@/tests/unit/src/context/shared/users/infrastructure/mock-user-repository";
import { Mock } from "@/tests/utils/mock";

import { FindByEmailQueryHandler } from "@/src/contexts/shared/users/application/find-by-email/find-by-email-query-handler";
import { UserFinder } from "@/src/contexts/shared/users/application/find-by-email/user-finder";
import { UserNotFount } from "@/src/contexts/shared/users/domain/user-not-fount";

import Logger from "@/contexts/shared/domain/logger";

import { FindByEmailQueryMother } from "./find-by-email-query-mother";

let logger: Mock<Logger>;
let repository: MockUserRepository;
let finder: UserFinder;
let handler: FindByEmailQueryHandler;

beforeEach(() => {
  logger = createMockLogger();
  repository = new MockUserRepository();
  finder = new UserFinder(logger, repository);
  handler = new FindByEmailQueryHandler(finder);
});

describe("FindByEmailQueryHandler should", () => {
  it("find an existing user", async () => {
    const query = FindByEmailQueryMother.create();
    const user = UserMother.fromQuery(query);

    repository.shouldFindByEmail(user);

    await handler.handle(query);
  });

  it("throw error finding a non existing user", () => {
    // eslint-disable-next-line vitest/valid-expect
    void expect(async () => {
      const query = FindByEmailQueryMother.create();

      const user = UserMother.fromQuery(query);

      repository.shouldNotSearch(user.email);

      await handler.handle(query);
    }).rejects.toThrow(UserNotFount);
  });
});
