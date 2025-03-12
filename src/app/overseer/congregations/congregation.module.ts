import { Module } from "@nestjs/common";

import { AuthModule } from "@/app/shared/auth/auth.module";

import { CongregationRepository } from "@/contexts/Overseer/congregations/domain/congregation-repository";
import { CongregationPrisma } from "@/contexts/Overseer/congregations/infrastructure/congregation-prisma";
import { NestExternalPrismaService } from "@/contexts/shared/infrastructure/persistence/prisma/services/nest-external-prisma.service";

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [
    CongregationPrisma,
    {
      provide: CongregationRepository,
      useFactory(p: NestExternalPrismaService) {
        return new CongregationPrisma(p);
      },
      inject: [NestExternalPrismaService],
    },
  ],
})
export class CongregationModule {}
