import { Query } from "@contexts/shared/domain/query";
import { QueryHandler } from "@contexts/shared/domain/query-handler";

import { SearchAllTerritoryQuery } from "./search-all-territories-query";
import { TerritoriesFinder } from "./territories-finder";
import { TerritoriesRespose } from "./territories-response";

export class SearchAllTerritoryQueryHandler
  implements QueryHandler<SearchAllTerritoryQuery, TerritoriesRespose>
{
  constructor(private territoriesFinder: TerritoriesFinder) {}

  subscribedTo(): Query {
    return SearchAllTerritoryQuery;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(_query: SearchAllTerritoryQuery): Promise<TerritoriesRespose> {
    return await this.territoriesFinder.fetch();
  }
}
