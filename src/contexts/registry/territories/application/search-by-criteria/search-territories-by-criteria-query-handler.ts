import { Filters } from "@contexts/shared/domain/criteria/filters";
import { Order } from "@contexts/shared/domain/criteria/order";
import { Query } from "@contexts/shared/domain/query";
import { QueryHandler } from "@contexts/shared/domain/query-handler";

import { TerritoriesRespose } from "../search-all/territories-response";
import { SearchTerritoriesByCriteriaQuery } from "./search-territories-by-criteria-query";
import { TerritoriesByCriteriaSearcher } from "./territories-by-criteria-searcher";

export class SearchTerritoriesByCriteriaQueryHandler
  implements QueryHandler<SearchTerritoriesByCriteriaQuery, TerritoriesRespose>
{
  constructor(private searcher: TerritoriesByCriteriaSearcher) {}

  subscribedTo(): Query {
    return SearchTerritoriesByCriteriaQuery;
  }

  handle(query: SearchTerritoriesByCriteriaQuery): Promise<TerritoriesRespose> {
    const filters = Filters.fromValues(query.filters);
    const order = Order.fromValues(query.orderBy, query.orderType);

    return this.searcher.search(filters, order, query.limit, query.pointer);
  }
}
