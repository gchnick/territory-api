import { FilterPrimitives } from "@/contexts/shared/domain/criteria/filter";
import { Query } from "@/contexts/shared/domain/query";

export class SearchTerritoriesByCriteriaQuery implements Query {
  readonly filters: FilterPrimitives[];
  readonly orderBy?: string;
  readonly orderType?: string;
  readonly limit?: number;
  readonly cursor?: string;

  constructor(
    filters: FilterPrimitives[],
    orderBy?: string,
    orderType?: string,
    limit?: number,
    cursor?: string,
  ) {
    this.filters = filters;
    this.orderBy = orderBy;
    this.orderType = orderType;
    this.limit = limit;
    this.cursor = cursor;
  }
}
