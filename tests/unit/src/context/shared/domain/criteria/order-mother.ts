import { faker } from "@faker-js/faker";

import { Order } from "@/contexts/shared/domain/criteria/order";
import { OrderTypes } from "@/contexts/shared/domain/criteria/order-type";

type OrderPrimitives = {
  orderBy?: string;
  orderType?: string;
};

export const OrderMother = {
  create(params?: Partial<OrderPrimitives>): Order {
    const randomOrderType =
      Object.values(OrderTypes)[
        Math.floor(Math.random() * Object.values(OrderTypes).length)
      ];

    const primitives: OrderPrimitives = {
      orderBy: faker.string.alpha(10),
      orderType: randomOrderType,
      ...params,
    };

    return Order.fromValues(primitives.orderBy, primitives.orderType);
  },
};
