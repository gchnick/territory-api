import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { EntitySchema, MixedList } from "typeorm";

import { EnviromentValueObject } from "@/contexts/shared/domain/value-object/enviroment-value-object";

import { EnviromentVariables } from "../configuration";

export const sqliteOptions = (
  configService: ConfigService<EnviromentVariables>,
  enviroment: EnviromentValueObject,
  // eslint-disable-next-line @typescript-eslint/ban-types
  entities?: MixedList<string | Function | EntitySchema<unknown>>,
): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions => {
  const isTestEnvironment = enviroment.isTest();
  const dropSchema = isTestEnvironment;
  const logging = enviroment.isDevelopment();
  const database = isTestEnvironment
    ? ":memory:"
    : configService.getOrThrow<string>("SQLITE_DATABASE");
  return {
    type: "sqlite",
    database,
    dropSchema,
    logging,
    synchronize: true,
    entities,
    autoLoadEntities: true,
  };
};
