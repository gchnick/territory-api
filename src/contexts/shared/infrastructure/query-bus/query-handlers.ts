import { Query } from "@/shared/domain/query";
import { QueryHandler } from "@/shared/domain/query-handler";
import { QueryNotRegisteredError } from "@/shared/domain/query-not-registered-error";
import { Response } from "@/shared/domain/response";

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
}
