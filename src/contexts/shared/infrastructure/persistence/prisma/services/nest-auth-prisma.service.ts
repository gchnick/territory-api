import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import { PrismaClient } from "@/db/client/auth";

@Injectable()
export class NestAuthPrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
