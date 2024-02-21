import { Query } from "./query";
import { Response } from "./response";

export abstract class QueryBus {
  abstract ask<R extends Response>(query: Query): Promise<R>;
}
