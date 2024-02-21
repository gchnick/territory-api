/* eslint-disable @typescript-eslint/require-await */
import { Query } from "@contexts/shared/domain/query";
import { QueryHandler } from "@contexts/shared/domain/query-handler";
import { QueryNotRegisteredError } from "@contexts/shared/domain/query-not-registered-error";
import { Response } from "@contexts/shared/domain/response";
import { InMemoryQueryBus } from "@contexts/shared/infrastructure/query-bus/in-memory-query-bus";
import { QueryHandlers } from "@contexts/shared/infrastructure/query-bus/query-handlers";

class UnhandledQuery extends Query {
  static QUERY_NAME = "unhandled.query";
}

class HandledQuery extends Query {
  static QUERY_NAME = "handled.query";
}

class MyQueryHandler implements QueryHandler<Query, Response> {
  subscribedTo(): HandledQuery {
    return HandledQuery;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(_query: HandledQuery): Promise<Response> {
    return {};
  }
}

describe("InMemoryQueryBus", () => {
  it("throws an error if dispatches a query without handler", async () => {
    const unhandledQuery = new UnhandledQuery();
    const queryHandlers = new QueryHandlers([]);
    const queryBus = new InMemoryQueryBus(queryHandlers);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises, jest/valid-expect
    expect(queryBus.ask(unhandledQuery)).rejects.toBeInstanceOf(
      QueryNotRegisteredError,
    );
  });

  it("accepts a query with handler", async () => {
    const handledQuery = new HandledQuery();
    const myQueryHandler = new MyQueryHandler();
    const queryHandlers = new QueryHandlers([myQueryHandler]);
    const queryBus = new InMemoryQueryBus(queryHandlers);

    await queryBus.ask(handledQuery);
  });
});
