import { Filter } from "@/shared/domain/criteria/filter";
import { Filters } from "@/shared/domain/criteria/filters";

import { FilterMother } from "./filter-mother";

export const FiltersMother = {
  create(params: Filter[] = []): Filters {
    return new Filters(params.length === 0 ? [FilterMother.create()] : params);
  },
};
