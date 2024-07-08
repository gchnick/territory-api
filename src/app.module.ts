import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "@/app/auth/auth.module";
import { TerritoryModule } from "@/app/territories/territory.module";
import { UserModule } from "@/app/user/user.module";

import { CommandModule } from "@/core/command-bus/command.module";
import configOptions from "@/core/config/config-options";
import jwtAsyncOptions from "@/core/config/jwt-async-options";
import routes from "@/core/config/routes";
import typeOrmOptions from "@/core/config/type-orm-options";
import { EventBusModule } from "@/core/event-bus/event-bus.module";
import { LoggerModule } from "@/core/logger/logger.module";
import { QueryModule } from "@/core/query-bus/query.module";

@Module({
  imports: [
    UserModule,
    AuthModule,
    TerritoryModule,
    LoggerModule,
    CommandModule,
    QueryModule,
    EventBusModule,
    ConfigModule.forRoot(configOptions()),
    JwtModule.registerAsync(jwtAsyncOptions()),
    TypeOrmModule.forRootAsync(typeOrmOptions()),
    RouterModule.register(routes()),
  ],
})
export class AppModule {}
