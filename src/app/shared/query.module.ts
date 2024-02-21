import { Global, Module, Provider } from "@nestjs/common";

import { QueryBus } from "@contexts/shared/domain/query-bus";
import { InMemoryQueryBus } from "@contexts/shared/infrastructure/query-bus/in-memory-query-bus";
import { QueryHandlers } from "@contexts/shared/infrastructure/query-bus/query-handlers";

const queryProviders: Provider[] = [
  { provide: QueryHandlers, useFactory: () => new QueryHandlers([]) },
  {
    provide: QueryBus,
    useFactory: (q: QueryHandlers) => new InMemoryQueryBus(q),
    inject: [QueryHandlers],
  },
];

@Global()
@Module({
  providers: [...queryProviders],
  exports: [...queryProviders],
})
export class QueryModule {}
