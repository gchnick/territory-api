import { Nullable } from "../nullable";
import { OrderBy } from "./order-by";
import { OrderType, OrderTypes } from "./order-type";

export class Order {
  readonly orderBy: OrderBy;
  readonly orderType: OrderType;

  constructor(orderBy: OrderBy, orderType: OrderType) {
    this.orderBy = orderBy;
    this.orderType = orderType;
  }

  static none(): Order {
    return new Order(new OrderBy(""), new OrderType(OrderTypes.NONE));
  }

  static desc(orderBy: string): Order {
    return new Order(new OrderBy(orderBy), new OrderType(OrderTypes.DESC));
  }

  static asc(orderBy: string): Order {
    return new Order(new OrderBy(orderBy), new OrderType(OrderTypes.ASC));
  }

  static fromPrimitives(
    orderBy?: Nullable<string>,
    orderType?: Nullable<string>,
  ): Order {
    return orderBy
      ? new Order(
          new OrderBy(orderBy),
          new OrderType((orderType as OrderTypes) || OrderTypes.ASC),
        )
      : Order.none();
  }

  hasOrder() {
    return !this.orderType.isNone();
  }

  isNone(): boolean {
    return this.orderType.isNone();
  }
}
