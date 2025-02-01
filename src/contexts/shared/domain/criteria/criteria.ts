import { Nullable } from "../nullable";
import { FiltersPrimitives } from "./filter";
import { Filters } from "./filters";
import { InvalidCriteria } from "./invalid-critera";
import { Order } from "./order";

export type CriteriaPrimitives = {
  filters: FiltersPrimitives[];
  orderBy?: Nullable<string>;
  orderType?: Nullable<string>;
  cursor?: Nullable<string>;
  limit?: Nullable<number>;
};

export class Criteria {
  readonly filters: Filters;
  readonly order: Order;
  readonly cursor: Nullable<string>;
  readonly limit: Nullable<number>;

  constructor(
    filters: Filters,
    order: Order,
    cursor: Nullable<string>,
    limit: Nullable<number>,
  ) {
    this.filters = filters;
    this.order = order;
    this.cursor = cursor;
    this.limit = limit;

    if (!limit && cursor) {
      throw new InvalidCriteria();
    }
  }

  static fromPrimitives(
    filters: FiltersPrimitives[],
    orderBy?: Nullable<string>,
    orderType?: Nullable<string>,
    cursor?: Nullable<string>,
    limit?: Nullable<number>,
  ): Criteria {
    return new Criteria(
      Filters.fromPrimitives(filters),
      Order.fromPrimitives(orderBy, orderType),
      cursor,
      limit,
    );
  }

  static withFilters(filters: FiltersPrimitives[]): Criteria {
    return Criteria.fromPrimitives(filters);
  }

  hasOrder(): boolean {
    return !this.order.isNone();
  }

  hasFilters(): boolean {
    return !this.filters.isEmpty();
  }
}
