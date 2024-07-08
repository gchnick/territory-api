import { Filter } from "@/contexts/shared/domain/criteria/filter";
import { Filters } from "@/contexts/shared/domain/criteria/filters";

import { FilterMother } from "./filter-mother";

export const FiltersMother = {
  create(params: Filter[] = []): Filters {
    return new Filters(params.length === 0 ? [FilterMother.create()] : params);
  },
};
