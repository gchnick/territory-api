import { faker } from "@faker-js/faker";

import {
  Criteria,
  CriteriaPrimitives,
} from "@/shared/domain/criteria/criteria";

import { FiltersMother } from "./filters-mother";
import { OrderMother } from "./order-mother";

export const CriteriaMother = {
  create(params?: Partial<CriteriaPrimitives>): Criteria {
    const defaultOrder = OrderMother.create();
    const primitives: CriteriaPrimitives = {
      filters: FiltersMother.create().toPrimitives(),
      orderBy: defaultOrder.orderBy.value,
      orderType: defaultOrder.orderType.value,
      cursor: faker.string.uuid(),
      limit: faker.number.int({ min: 1, max: 100 }),
      ...params,
    };

    return Criteria.fromPrimitives(
      primitives.filters,
      primitives.orderBy,
      primitives.orderType,
      primitives.cursor,
      primitives.limit,
    );
  },

  empty(): Criteria {
    return Criteria.withFilters([]);
  },

  emptySorted(orderBy: string, orderType: string): Criteria {
    return Criteria.fromPrimitives([], orderBy, orderType);
  },

  emptyPaginated(cursor: string, limit: number): Criteria {
    return Criteria.fromPrimitives([], undefined, undefined, cursor, limit);
  },

  withOneFilter(field: string, operator: string, value: string): Criteria {
    return Criteria.withFilters([
      {
        field,
        operator,
        value,
      },
    ]);
  },

  withOneFilterSorted(
    field: string,
    operator: string,
    value: string,
    orderBy: string,
    orderType: string,
  ): Criteria {
    return Criteria.fromPrimitives(
      [
        {
          field,
          operator,
          value,
        },
      ],
      orderBy,
      orderType,
    );
  },
};
