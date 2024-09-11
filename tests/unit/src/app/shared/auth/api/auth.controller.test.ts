import createMockCommandBus from "@/tests/unit/src/context/shared/infrastructure/command-bus/mock-command-bus";
import createMockLogger from "@/tests/unit/src/context/shared/infrastructure/mock-logger";
import createMockQueryBus from "@/tests/unit/src/context/shared/infrastructure/query-bus/mock-query-bus";
import { Mock } from "@/tests/utils/mock";

import { AuthPostController } from "@/app/shared/auth/api/auth-post.controller";

import { CommandBus } from "@/shared/domain/command-bus";
import Logger from "@/shared/domain/logger";
import { QueryBus } from "@/shared/domain/query-bus";

describe("AuthPostController", () => {
  let authPostController: AuthPostController;
  let logger: Mock<Logger>;
  let commandBus: Mock<CommandBus>;
  let queryBus: Mock<QueryBus>;

  beforeEach(() => {
    logger = createMockLogger();
    commandBus = createMockCommandBus();
    queryBus = createMockQueryBus();
    authPostController = new AuthPostController(logger, commandBus, queryBus);
  });

  it("should be defined", () => {
    expect(authPostController).toBeDefined();
  });
});
