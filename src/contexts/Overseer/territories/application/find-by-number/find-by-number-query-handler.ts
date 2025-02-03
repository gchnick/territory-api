/* eslint-disable unicorn/no-array-method-this-argument */
/* eslint-disable unicorn/no-array-callback-reference */
import { Query } from "@/shared/domain/query";
import { QueryHandler } from "@/shared/domain/query-handler";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { CongregationId } from "@/contexts/Overseer/congregations/domain/congregation-id";
import { TerritoryNumber } from "@/contexts/Overseer/territories/domain/territory-number";

import { FindByNumberQuery } from "./find-by-number-query";
import { TerritoryFinder } from "./territory-finder";
import { TerritoryResponse } from "./territory-response";

@Injectable()
export class FindByNumberQueryHandler
  implements QueryHandler<FindByNumberQuery, TerritoryResponse>
{
  constructor(private readonly territoryFinder: TerritoryFinder) {}

  subscribedTo(): Query {
    return FindByNumberQuery;
  }

  async handle(query: FindByNumberQuery): Promise<TerritoryResponse> {
    const congregationId = new CongregationId(query.congregationId);
    const number = new TerritoryNumber(query.number);
    return this.territoryFinder.find(congregationId, number);
  }
}
