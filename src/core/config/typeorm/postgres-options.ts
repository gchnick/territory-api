import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { EntitySchema, MixedList } from "typeorm";

import { EnviromentVariables } from "../configuration";

export const postgresOptions = (
  configService: ConfigService<EnviromentVariables>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  entities?: MixedList<string | Function | EntitySchema<unknown>>,
): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions => {
  return {
    type: "postgres",
    host: configService.get("DATABASE.HOST", { infer: true }),
    port: configService.get("DATABASE.PORT", { infer: true }),
    database: configService.get("DATABASE.NAME", { infer: true }),
    username: configService.get("DATABASE.USERNAME", { infer: true }),
    password: configService.get("DATABASE.PASSWORD", { infer: true }),
    synchronize: false,
    entities,
    autoLoadEntities: true,
  };
};
