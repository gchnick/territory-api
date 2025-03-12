import { Global, Module } from "@nestjs/common";

import { NestAuthPrismaService } from "./services/nest-auth-prisma.service";
import { NestExternalPrismaService } from "./services/nest-external-prisma.service";
import { NestLocalPrismaService } from "./services/nest-local-prisma.service";

@Global()
@Module({
  providers: [
    NestAuthPrismaService,
    NestExternalPrismaService,
    NestLocalPrismaService,
  ],
  exports: [
    NestAuthPrismaService,
    NestExternalPrismaService,
    NestLocalPrismaService,
  ],
})
export class PrismaModule {}
