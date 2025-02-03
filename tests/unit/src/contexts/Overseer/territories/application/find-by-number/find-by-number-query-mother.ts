import { CongregationIdMother } from "@/tests/unit/src/contexts/Overseer/congregation/domain/congregation-id-mother";
import { TerritoryNumberMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-number-mother";

import { FindByNumberQuery } from "@/contexts/Overseer/territories/application/find-by-number/find-by-number-query";

export const FindByNumberQueryMother = {
  create(congregationId?: number, number?: number): FindByNumberQuery {
    return new FindByNumberQuery(
      congregationId ?? CongregationIdMother.create().value,
      number ?? TerritoryNumberMother.create().value,
    );
  },
};
