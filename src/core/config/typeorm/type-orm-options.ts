import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { EntitySchema, MixedList } from "typeorm";

import Logger from "@/contexts/shared/domain/logger";
import { EnviromentValueObject } from "@/contexts/shared/domain/value-object/enviroment-value-object";

import { EnviromentVariables } from "../configuration";
import { postgresOptions } from "./postgres-options";
import { sqliteOptions } from "./sqlite-options";

const typeOrmOptions = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  entities?: MixedList<string | Function | EntitySchema<unknown>>,
): TypeOrmModuleAsyncOptions => ({
  inject: [ConfigService, Logger],
  useFactory: (
    configService: ConfigService<EnviromentVariables>,
    logger: Logger,
  ) => {
    const nodeEnv = configService.getOrThrow<string>("NODE_ENV");
    const environment = EnviromentValueObject.fromValue(nodeEnv);
    logger.log(`NODE_ENV => <${environment.value}>`);
    const useSqlite = environment.isDevelopment() || environment.isTest();

    return useSqlite
      ? sqliteOptions(configService, environment, entities)
      : postgresOptions(configService, entities);
  },
});
export default typeOrmOptions;
