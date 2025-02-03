import {
    Congregation,
    CongregationPrimitives,
} from "@/contexts/Overseer/congregations/domain/congregation";

import { CongregationCircuitMother } from "./congregation-circuit-mother";
import { CongregationIdMother } from "./congregation-id-mother";
import { CongregationLimitsMother } from "./congregation-limits.mother";
import { CongregationNameMother } from "./congregation-name-mother";
import { CongregationNumberOfTerritoriesMother } from "./congregation-number-of-territories-mother";

export const CongregationMother = {
  create(params?: Partial<CongregationPrimitives>): Congregation {
    const primitives: CongregationPrimitives = {
      number: CongregationIdMother.create().value,
      name: CongregationNameMother.create().value,
      circuit: CongregationCircuitMother.create().value,
      limits: CongregationLimitsMother.create().toPrimitives(),
      numberOfTerritories: CongregationNumberOfTerritoriesMother.create().value,
      ...params,
    };

    return Congregation.fromPrimitives(primitives);
  },
};
