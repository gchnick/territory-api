/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query } from "@/contexts/shared/domain/query";
import { QueryHandler } from "@/contexts/shared/domain/query-handler";
import { Injectable } from "@/contexts/shared/infrastructure/dependency-injection/injectable";

import { SearchAllTerritoryQuery } from "./search-all-territories-query";
import { TerritoriesFinder } from "./territories-finder";
import { TerritoriesResponse } from "./territories-response";

@Injectable()
export class SearchAllTerritoryQueryHandler
  implements QueryHandler<SearchAllTerritoryQuery, TerritoriesResponse>
{
  constructor(private readonly territoriesFinder: TerritoriesFinder) {}

  subscribedTo(): Query {
    return SearchAllTerritoryQuery;
  }

  async handle(_query: SearchAllTerritoryQuery): Promise<TerritoriesResponse> {
    return await this.territoriesFinder.fetch();
  }
}
