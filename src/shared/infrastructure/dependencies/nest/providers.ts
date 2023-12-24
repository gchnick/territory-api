import { Provider } from '@nestjs/common';
import { CommandBus } from '@shared/domain/command-bus';
import { EventBus } from '@shared/domain/event-bus';
import Logger from '@shared/domain/logger';
import { QueryBus } from '@shared/domain/query-bus';
import { NestLogger } from '@territories/infrastructure/dependencies/nest/nest.logger';
import { CommandHandlers } from '../../command-bus/command-handlers';
import { InMemoryCommandBus } from '../../command-bus/in-memory-command-bus';
import { InMemoryAsyncEventBus } from '../../event-bus/in-memory/in-memory-async-event-bus';
import { InMemoryQueryBus } from '../../query-bus/in-memory-query-bus';
import { QueryHandlers } from '../../query-bus/query-handlers';

export const NEST_ROOT_PROVIDERS: Provider[] = [
  { provide: Logger, useClass: NestLogger },
  { provide: CommandHandlers, useFactory: () => new CommandHandlers([]) },
  { provide: QueryHandlers, useFactory: () => new CommandHandlers([]) },
  {
    provide: CommandBus,
    useFactory: (c: CommandHandlers) => new InMemoryCommandBus(c),
    inject: [CommandHandlers],
  },
  {
    provide: QueryBus,
    useFactory: (q: QueryHandlers) => new InMemoryQueryBus(q),
    inject: [QueryHandlers],
  },
  { provide: EventBus, useClass: InMemoryAsyncEventBus },
];

export const NEST_ROOT_EXPORTS = [
  Logger,
  CommandBus,
  QueryBus,
  EventBus,
  CommandHandlers,
  QueryHandlers,
];
