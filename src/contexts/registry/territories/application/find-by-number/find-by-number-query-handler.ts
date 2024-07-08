import { TerritoryNumber } from "@/contexts/registry/territories/domain/territory-number";
import { Query } from "@/contexts/shared/domain/query";
import { QueryHandler } from "@/contexts/shared/domain/query-handler";
import { Injectable } from "@/contexts/shared/infrastructure/dependency-injection/injectable";

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
    const number = new TerritoryNumber(query.number);
    return await this.territoryFinder.find(number);
  }
}
