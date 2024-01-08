import { Filters } from '@shared/domain/criteria/filters';
import { Order } from '@shared/domain/criteria/order';
import { Query } from '@shared/domain/query';
import { QueryHandler } from '@shared/domain/query-handler';
import { TerritoriesRespose } from '../search-all/territories-response';
import { SearchTerritoriesByCriteriaQuery } from './search-territories-by-criteria-query';
import { TerritoriesByCriteriaSearcher } from './territories-by-criteria-searcher';

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

    return this.searcher.run(filters, order, query.limit, query.offset);
  }
}
