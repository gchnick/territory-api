import { Module } from "@nestjs/common";

import { AuthModule } from "@/app/shared/auth/auth.module";

import { CongregationRepository } from "@/contexts/Overseer/congregations/domain/congregation-repository";
import { CongregationPrisma } from "@/contexts/Overseer/congregations/infrastructure/congregation-prisma";

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [
    CongregationPrisma,
    {
      provide: CongregationRepository,
      useExisting: CongregationPrisma,
    },
  ],
})
export class CongregationModule {}
