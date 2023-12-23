import { Query } from '@shared/domain/query';
import { QueryHandler } from '@shared/domain/query-handler';
import { TerritoryNumber } from '@territories/domain/territory-number';
import { FindByNumberQuery } from './find-by-number-query';
import { TerritoryFinder } from './territory-finder';
import { TerritoryResponse } from './territory-response';

export class FindByNumberQueryHandler
  implements QueryHandler<FindByNumberQuery, TerritoryResponse>
{
  constructor(private territoryFinder: TerritoryFinder) {}

  subscribedTo(): Query {
    return FindByNumberQuery;
  }

  async handle(query: FindByNumberQuery): Promise<TerritoryResponse> {
    const number = new TerritoryNumber(query.number);
    return await this.territoryFinder.run(number);
  }
}
