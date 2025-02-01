import { QueryHandler } from "@/shared/domain/query-handler";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { Query } from "@/contexts/shared/domain/query";

import { TerritoriesResponse } from "../search-all/territories-response";
import { SearchTerritoriesByCriteriaQuery } from "./search-territories-by-criteria-query";
import { TerritoriesByCriteriaSearcher } from "./territories-by-criteria-searcher";

@Injectable()
export class SearchTerritoriesByCriteriaQueryHandler
  implements
    QueryHandler<SearchTerritoriesByCriteriaQuery, TerritoriesResponse>
{
  constructor(private readonly searcher: TerritoriesByCriteriaSearcher) {}

  subscribedTo(): Query {
    return SearchTerritoriesByCriteriaQuery;
  }

  handle(
    query: SearchTerritoriesByCriteriaQuery,
  ): Promise<TerritoriesResponse> {
    return this.searcher.search(query.criteria);
  }
}
