import { Module } from "@nestjs/common";
import { ConditionalModule, ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";

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
    UserModule,
    AuthModule,
    HealthModule,
    TerritoryModule,
    LoggerModule,
    CommandModule,
    QueryModule,
    EventBusModule,
    PrismaModule,
    ConfigModule.forRoot(configOptions()),
    JwtModule.registerAsync(jwtAsyncOptions()),
    RouterModule.register(routes()),
    ConditionalModule.registerWhen(SeedModule, "USE_SEEDS"),
  ],
})
export class AppModule {}
