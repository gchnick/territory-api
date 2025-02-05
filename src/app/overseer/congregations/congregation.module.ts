import { Module } from "@nestjs/common";

import { AuthModule } from "@/app/shared/auth/auth.module";

import { CongregationRepository } from "@/contexts/Overseer/congregations/domain/congregation-repository";
import { CongregationPrisma } from "@/contexts/Overseer/congregations/infrastructure/congregation-prisma";
import { NestPrismaService } from "@/contexts/shared/infrastructure/persistence/prisma/nest-prisma-service";

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [
    CongregationPrisma,
    {
      provide: CongregationRepository,
      useFactory(p: NestPrismaService) {
        return new CongregationPrisma(p);
      },
      inject: [NestPrismaService],
    },
  ],
})
export class CongregationModule {}
