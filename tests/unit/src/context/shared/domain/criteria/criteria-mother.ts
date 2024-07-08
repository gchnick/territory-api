import {
  Criteria,
  CriteriaPrimitives,
} from "@/contexts/shared/domain/criteria/criteria";

import { FiltersMother } from "./filters-mother";
import { OrderMother } from "./order-mother";

export const CriteriaMother = {
  create(params?: Partial<CriteriaPrimitives>): Criteria {
    const defaultOrder = OrderMother.create();
    const primitives: CriteriaPrimitives = {
      filters: FiltersMother.create().toPrimitives(),
      orderBy: defaultOrder.orderBy.value,
      orderType: defaultOrder.orderType.value,
      ...params,
    };

    return Criteria.fromPrimitives(
      primitives.filters,
      primitives.orderBy,
      primitives.orderType,
    );
  },
};
