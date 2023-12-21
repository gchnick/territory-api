import { CommandBus } from 'src/shared/domain/command-bus';
import { EventBus } from 'src/shared/domain/event-bus';
import { QueryBus } from 'src/shared/domain/query-bus';
import { InMemoryCommandBus } from '../command-bus/in-memory-command-bus';
import { InMemoryAsyncEventBus } from '../event-bus/in-memory/in-memory-async-event-bus';
import { InMemoryQueryBus } from '../query-bus/in-memory-query-bus';

export const NEST_ROOT_PROVIDERS = [
  { provide: CommandBus, useClass: InMemoryCommandBus },
  { provide: QueryBus, useClass: InMemoryQueryBus },
  { provide: EventBus, useClass: InMemoryAsyncEventBus },
];
