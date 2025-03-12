import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import { PrismaClient } from "@/db/client/local";

@Injectable()
export class NestLocalPrismaService
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
