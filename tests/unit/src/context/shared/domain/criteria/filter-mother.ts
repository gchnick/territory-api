import { faker } from "@faker-js/faker";

import {
  Filter,
  FilterPrimitives,
} from "@contexts/shared/domain/criteria/filter";
import { Operator } from "@contexts/shared/domain/criteria/filter-operator";

export const FilterMother = {
  create(params?: Partial<FilterPrimitives>): Filter {
    const randomOperator =
      Object.values(Operator)[
        Math.floor(Math.random() * Object.values(Operator).length)
      ];

    const primitives: FilterPrimitives = {
      field: faker.string.alpha(10),
      operator: randomOperator,
      value: faker.string.alpha(10),
      ...params,
    };

    return Filter.fromPrimitives(
      primitives.field,
      primitives.operator,
      primitives.value,
    );
  },
};