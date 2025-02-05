import { Query } from "@/shared/domain/query";

import { Criteria } from "@/contexts/shared/domain/criteria/criteria";

export class SearchTerritoriesByCriteriaQuery implements Query {
  readonly criteria: Criteria;

  constructor(criteria: Criteria) {
    this.criteria = criteria;
  }
}
