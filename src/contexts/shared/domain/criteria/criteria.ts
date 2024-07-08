import { FilterPrimitives } from "./filter";
import { Filters } from "./filters";
import { Order } from "./order";

export type CriteriaPrimitives = {
  filters: FilterPrimitives[];
  orderBy?: string;
  orderType?: string;
};

export class Criteria {
  readonly filters: Filters;
  readonly order: Order;
  readonly limit?: number;
  readonly cursor?: string;

  constructor(filters: Filters, order: Order, limit?: number, cursor?: string) {
    this.filters = filters;
    this.order = order;
    this.limit = limit;
    this.cursor = cursor;
  }

  hasFilters(): boolean {
    return this.filters.value.length > 0;
  }

  hasOrder(): boolean {
    return !this.order.isNone();
  }

  static fromPrimitives(
    filters: FilterPrimitives[],
    orderBy?: string,
    orderType?: string,
    limit?: number,
    cursor?: string,
  ): Criteria {
    return new Criteria(
      Filters.fromPrimitives(filters),
      Order.fromValues(orderBy, orderType),
      limit,
      cursor,
    );
  }
}
