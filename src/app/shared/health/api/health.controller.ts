import { Controller, Get, HttpCode, Inject } from "@nestjs/common";

import Logger from "@/shared/domain/logger";

@Controller("health")
export class HealthController {
  constructor(@Inject(Logger) private readonly logger: Logger) {}

  @Get()
  @HttpCode(200)
  run() {
    this.logger.log("Health endpoint called!");
    return { status: "ok" };
  }
}
