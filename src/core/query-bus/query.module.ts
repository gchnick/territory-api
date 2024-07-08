import { Global, Module } from "@nestjs/common";

import { AuthModule } from "@/app/auth/auth.module";
import { TerritoryModule } from "@/app/territories/territory.module";
import { UserModule } from "@/app/user/user.module";

import { Query } from "@/contexts/shared/domain/query";
import { QueryBus } from "@/contexts/shared/domain/query-bus";
import { QueryHandler } from "@/contexts/shared/domain/query-handler";
import { Response } from "@/contexts/shared/domain/response";
import { InMemoryQueryBus } from "@/contexts/shared/infrastructure/query-bus/in-memory-query-bus";
import { QueryHandlers } from "@/contexts/shared/infrastructure/query-bus/query-handlers";

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
