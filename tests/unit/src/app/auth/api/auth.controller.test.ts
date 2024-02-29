import { Test, TestingModule } from "@nestjs/testing";

import { AuthPostController } from "@app/auth/api/auth-post.controller";

import { CommandBus } from "@contexts/shared/domain/command-bus";
import Logger from "@contexts/shared/domain/logger";
import { QueryBus } from "@contexts/shared/domain/query-bus";

import { MockCommandBus } from "../../../context/shared/infrastructure/command-bus/mock-command-bus";
import { MockLogger } from "../../../context/shared/infrastructure/mock-logger";
import { MockQueryBus } from "../../../context/shared/infrastructure/query-bus/mock-query-bus";

describe("AuthPostController", () => {
  let controller: AuthPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthPostController],
      providers: [
        { provide: Logger, useClass: MockLogger },
        { provide: CommandBus, useClass: MockCommandBus },
        { provide: QueryBus, useClass: MockQueryBus },
      ],
    }).compile();

    controller = module.get<AuthPostController>(AuthPostController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
