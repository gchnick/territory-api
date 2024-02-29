import { Query } from "@contexts/shared/domain/query";
import { QueryBus } from "@contexts/shared/domain/query-bus";
import { Response } from "@contexts/shared/domain/response";

export class MockQueryBus extends QueryBus {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ask<R extends Response>(_: Query): Promise<R> {
    throw new Error("Method not implemented.");
  }
}
