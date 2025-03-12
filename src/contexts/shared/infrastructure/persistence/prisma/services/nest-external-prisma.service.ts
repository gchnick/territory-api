import { createClient } from "@libsql/client";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

import { PrismaClient } from "@/db/client/external";

import { configuration, environment } from "@/core/config/configuration";

@Injectable()
export class NestExternalPrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // eslint-disable-next-line unicorn/no-null
    let adapter = null;

    if (environment.isProduction()) {
      const url = configuration().TURSO.DATABASE_URL;
      const authToken = configuration().TURSO.AUTH_TOKEN;

      const libsql = createClient({
        url,
        authToken,
      });

      adapter = new PrismaLibSQL(libsql);
    }

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
