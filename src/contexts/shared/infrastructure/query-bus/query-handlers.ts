import { Query } from "@contexts/shared/domain/query";
import { QueryHandler } from "@contexts/shared/domain/query-handler";
import { QueryNotRegisteredError } from "@contexts/shared/domain/query-not-registered-error";
import { Response } from "@contexts/shared/domain/response";

export class QueryHandlers extends Map<Query, QueryHandler<Query, Response>> {
  constructor(queryHandlers: Array<QueryHandler<Query, Response>>) {
    super();
    for (const queryHandler of queryHandlers) {
      this.set(queryHandler.subscribedTo(), queryHandler);
    }
  }

  public get(query: Query): QueryHandler<Query, Response> {
    const queryHandler = super.get(query.constructor);

    if (!queryHandler) {
      throw new QueryNotRegisteredError(query);
    }

    return queryHandler;
  }

  public add(queryHandlers: Array<QueryHandler<Query, Response>>) {
    for (const queryHandler of queryHandlers) {
      this.set(queryHandler.subscribedTo(), queryHandler);
    }
  }
}
