import { FindByEmailQueryHandler } from "@/contexts/registry/users/application/find-by-email/find-by-email-query-handler";
import { UserFinder } from "@/contexts/registry/users/application/find-by-email/user-finder";
import { UserNotFount } from "@/contexts/registry/users/domain/user-not-fount";

import { MockLogger } from "../../../../shared/infrastructure/mock-logger";
import { UserMother } from "../../domain/user-mother";
import { MockUserRepository } from "../../infrastructure/mock-user-repository";
import { FindByEmailQueryMother } from "./find-by-email-query-mother";

let logger: MockLogger;
let repository: MockUserRepository;
let finder: UserFinder;
let handler: FindByEmailQueryHandler;

beforeEach(() => {
  logger = new MockLogger();
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
    // eslint-disable-next-line jest/valid-expect
    void expect(async () => {
      const query = FindByEmailQueryMother.create();

      const user = UserMother.fromQuery(query);

      repository.shouldNotSearch(user.email);

      await handler.handle(query);
    }).rejects.toThrow(UserNotFount);
  });
});
