import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommandModule } from "@/core/command-bus/command.module";
import configOptions from "@/core/config/config-options";
import jwtAsyncOptions from "@/core/config/jwt-async-options";
import routes from "@/core/config/routes";
import typeOrmOptions from "@/core/config/typeorm/type-orm-options";
import { EventBusModule } from "@/core/event-bus/event-bus.module";
import { LoggerModule } from "@/core/logger/logger.module";
import { QueryModule } from "@/core/query-bus/query.module";

import { TYPE_ORM_ENTITIES } from "./constants";

export const baseTestModuleImports = () => {
  return [
    LoggerModule,
    CommandModule,
    QueryModule,
    EventBusModule,
    TypeOrmModule.forRootAsync(typeOrmOptions(TYPE_ORM_ENTITIES)),
    ConfigModule.forRoot(configOptions()),
    JwtModule.registerAsync(jwtAsyncOptions()),
    RouterModule.register(routes()),
  ];
};
