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
  readonly pointer?: string;

  constructor(
    filters: Filters,
    order: Order,
    limit?: number,
    pointer?: string,
  ) {
    this.filters = filters;
    this.order = order;
    this.limit = limit;
    this.pointer = pointer;
  }

  public hasFilters(): boolean {
    return this.filters.filters.length > 0;
  }

  static fromPrimitives(
    filters: FilterPrimitives[],
    orderBy?: string,
    orderType?: string,
    limit?: number,
    pointer?: string,
  ): Criteria {
    return new Criteria(
      Filters.fromPrimitives(filters),
      Order.fromValues(orderBy, orderType),
      limit,
      pointer,
    );
  }
}
