import { Global, Module } from "@nestjs/common";

import { AuthModule } from "@/src/app/shared/auth/auth.module";
import { TerritoryModule } from "@/src/app/overseer/territories/territory.module";
import { UserModule } from "@/src/app/shared/user/user.module";

import { Query } from "@/shared/domain/query";
import { QueryBus } from "@/shared/domain/query-bus";
import { QueryHandler } from "@/shared/domain/query-handler";
import { Response } from "@/shared/domain/response";
import { InMemoryQueryBus } from "@/shared/infrastructure/query-bus/in-memory-query-bus";
import { QueryHandlers } from "@/shared/infrastructure/query-bus/query-handlers";

@Global()
@Module({
  imports: [AuthModule, UserModule, TerritoryModule],
  providers: [
    {
      provide: QueryHandlers,
      useFactory: (
        user: Array<QueryHandler<Query, Response>>,
        auth: Array<QueryHandler<Query, Response>>,
        territory: Array<QueryHandler<Query, Response>>,
      ) => new QueryHandlers([...user, ...auth, ...territory]),
      inject: [
        "UserQueryHandlers",
        "AuthQueryHandlers",
        "TerritoryQueryHandlers",
      ],
    },
    {
      provide: QueryBus,
      useFactory: (q: QueryHandlers) => new InMemoryQueryBus(q),
      inject: [QueryHandlers],
    },
  ],
  exports: [QueryBus],
})
export class QueryModule {}
