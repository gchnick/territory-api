import { DataSource } from "typeorm";

import { TypeOrmConfig } from "./type-orm-config";

export const TypeOrmClientFactory = {
  // eslint-disable-next-line @typescript-eslint/require-await
  async createClient(
    contextName: string,
    config: TypeOrmConfig,
  ): Promise<DataSource> {
    const dataSource = new DataSource({
      name: contextName,
      type: "postgres",
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      entities: [
        __dirname +
          "/../../../../**/**/infrastructure/persistence/typeorm/*{.js,.ts}",
      ],
      synchronize: true,
      logging: true,
    });

    return dataSource;
  },
};
