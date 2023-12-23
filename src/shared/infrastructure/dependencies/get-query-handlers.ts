import { Query } from 'src/shared/domain/query';
import { QueryHandler } from 'src/shared/domain/query-handler';
import { Response } from 'src/shared/domain/response';
import { QueryHandlers } from '../query-bus/query-handlers';

export function getQueryHandlers(
  commandHandlers: QueryHandlers,
): Array<QueryHandler<Query, Response>> {
  const currentHandlers = commandHandlers.values();
  const handlers: Array<QueryHandler<Query, Response>> = [];
  for (const handler of currentHandlers) {
    handlers.push(handler);
  }
  return handlers;
}
