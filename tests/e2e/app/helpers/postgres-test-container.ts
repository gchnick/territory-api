import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";

import configuration from "@/core/config/configuration";

export const PostgresTestContainer = {
  port(): number {
    return configuration().database.port;
  },
  async container(): Promise<StartedPostgreSqlContainer> {
    return await new PostgreSqlContainer("postgres:16.2-alpine3.19").start();
  },
};
