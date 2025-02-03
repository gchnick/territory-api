import { Module } from "@nestjs/common";

import { SeedController } from "./seed-post.controller";

@Module({
  controllers: [SeedController],
})
export class SeedModule {
  static CONDITION_KEY = "USE_SEEDS";
}
