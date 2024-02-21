import { Query } from "@contexts/shared/domain/query";

export class SearchTerritoriesByCriteriaQuery implements Query {
  readonly filters: Array<Map<string, string>>;
  readonly orderBy?: string;
  readonly orderType?: string;
  readonly limit?: number;
  readonly pointer?: string;

  constructor(
    filters: Array<Map<string, string>>,
    orderBy?: string,
    orderType?: string,
    limit?: number,
    pointer?: string,
  ) {
    this.filters = filters;
    this.orderBy = orderBy;
    this.orderType = orderType;
    this.limit = limit;
    this.pointer = pointer;
  }
}
