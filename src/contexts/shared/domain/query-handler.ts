import { Query } from "./query";
import { Response } from "./response";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface QueryHandler<Q extends Query, R extends Response> {
  subscribedTo(): Query;
  handle(query: Q): Promise<R>;
}
