import { Module } from "@nestjs/common";
import { ConditionalModule, ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";

import { CongregationModule } from "@/app/overseer/congregations/congregation.module";
import { TerritoryModule } from "@/app/overseer/territories/territory.module";
import { AuthModule } from "@/app/shared/auth/auth.module";
import { HealthModule } from "@/app/shared/health/health.module";
import { UserModule } from "@/app/shared/user/user.module";

import { PrismaModule } from "@/contexts/shared/infrastructure/persistence/prisma/prisma.module";

import { CommandModule } from "@/core/command-bus/command.module";
import configOptions from "@/core/config/config-options";
import jwtAsyncOptions from "@/core/config/jwt-async-options";
import routes from "@/core/config/routes";
import { EventBusModule } from "@/core/event-bus/event-bus.module";
import { LoggerModule } from "@/core/logger/logger.module";
import { QueryModule } from "@/core/query-bus/query.module";
import { SeedModule } from "@/core/seed/seed.module";

@Module({
  imports: [
    AuthModule,
    CommandModule,
    ConditionalModule.registerWhen(SeedModule, SeedModule.CONDITION_KEY),
    ConfigModule.forRoot(configOptions()),
    CongregationModule,
    EventBusModule,
    HealthModule,
    JwtModule.registerAsync(jwtAsyncOptions()),
    LoggerModule,
    PrismaModule,
    QueryModule,
    RouterModule.register(routes()),
    TerritoryModule,
    UserModule,
  ],
})
export class AppModule {}
