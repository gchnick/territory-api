import { Provider } from '@nestjs/common';
import { CommandBus } from 'src/shared/domain/command-bus';
import { EventBus } from 'src/shared/domain/event-bus';
import { QueryBus } from 'src/shared/domain/query-bus';
import { CommandHandlers } from '../command-bus/command-handlers';
import { InMemoryCommandBus } from '../command-bus/in-memory-command-bus';
import { InMemoryAsyncEventBus } from '../event-bus/in-memory/in-memory-async-event-bus';
import { InMemoryQueryBus } from '../query-bus/in-memory-query-bus';
import { QueryHandlers } from '../query-bus/query-handlers';

export const NEST_ROOT_PROVIDERS: Provider[] = [
  { provide: CommandBus, useClass: InMemoryCommandBus },
  { provide: QueryBus, useClass: InMemoryQueryBus },
  { provide: EventBus, useClass: InMemoryAsyncEventBus },
  { provide: CommandHandlers, useFactory: () => new CommandHandlers([]) },
  { provide: QueryHandlers, useFactory: () => new CommandHandlers([]) },
];

export const NEST_ROOT_EXPORTS = [
  CommandBus,
  QueryBus,
  EventBus,
  CommandHandlers,
  QueryHandlers,
];
