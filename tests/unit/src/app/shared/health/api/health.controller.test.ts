import createMockLogger from "@/tests/unit/src/context/shared/infrastructure/mock-logger";
import { Mock } from "@/tests/utils/mock";

import { HealthController } from "@/src/app/shared/health/api/health.controller";

import Logger from "@/shared/domain/logger";

describe("HealthController", () => {
  let healthController: HealthController;
  let logger: Mock<Logger>;

  beforeEach(() => {
    logger = createMockLogger();
    healthController = new HealthController(logger);
  });

  describe("run", () => {
    it("should return is healthy", () => {
      expect(healthController.run()).toEqual({ status: "ok" });
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });
});
