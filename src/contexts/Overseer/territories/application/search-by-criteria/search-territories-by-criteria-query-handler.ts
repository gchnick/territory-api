import { Filters } from "@/shared/domain/criteria/filters";
import { Order } from "@/shared/domain/criteria/order";
import { Query } from "@/shared/domain/query";
import { QueryHandler } from "@/shared/domain/query-handler";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

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
    const filters = Filters.fromPrimitives(query.filters);
    const order = Order.fromValues(query.orderBy, query.orderType);

    return this.searcher.search(filters, order, query.limit, query.cursor);
  }
}
