import { Global, Module } from "@nestjs/common";

import { NestPrismaService } from "./nest-prisma-service";

@Global()
@Module({
  providers: [NestPrismaService],
  exports: [NestPrismaService],
})
export class PrismaModule {}
