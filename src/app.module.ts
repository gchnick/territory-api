import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "@app/auth/auth.module";
import { CommandModule } from "@app/shared/command.module";
import { EventBusModule } from "@app/shared/event-bus.module";
import { QueryModule } from "@app/shared/query.module";
import { TerritoryModule } from "@app/territories/territory.module";
import { UserModule } from "@app/user/user.module";

import configOptions from "@core/config/config-options";
import jwtAsyncOptions from "@core/config/jwt-async-options";
import routes from "@core/config/routes";
import typeOrmOptions from "@core/config/type-orm-options";
import { LoggerModule } from "@core/logger/logger.module";

@Module({
  imports: [
    ConfigModule.forRoot(configOptions()),
    JwtModule.registerAsync(jwtAsyncOptions()),
    TypeOrmModule.forRootAsync(typeOrmOptions()),
    AuthModule,
    UserModule,
    TerritoryModule,
    LoggerModule,
    CommandModule,
    QueryModule,
    EventBusModule,
    RouterModule.register(routes()),
  ],
})
export class AppModule {}
