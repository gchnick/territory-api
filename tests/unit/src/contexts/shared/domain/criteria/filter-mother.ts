import { faker } from "@faker-js/faker";

import { Filter, FilterPrimitives } from "@/shared/domain/criteria/filter";
import { Operator } from "@/shared/domain/criteria/filter-operator";

export const FilterMother = {
  create(params?: Partial<FilterPrimitives>): Filter {
    const randomOperator =
      Object.keys(Operator)[
        Math.floor(Math.random() * Object.keys(Operator).length)
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
