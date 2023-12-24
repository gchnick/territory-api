import { Provider } from '@nestjs/common';
import Logger from '@shared/domain/logger';
import { FindByNumberQueryHandler } from '@territories/application/find-by-number/find-by-number-query-handler';
import { TerritoryFinder } from '@territories/application/find-by-number/territory-finder';
import { SearchAllTerritoryQueryHandler } from '@territories/application/search-all/search-all-territories-query-handler';
import { TerritoriesFinder } from '@territories/application/search-all/territories-finder';
import { TerritoryRepository } from '@territories/domain/territory-repository';

const handlersHelpersFactory: Provider[] = [
  {
    provide: TerritoriesFinder,
    useFactory: (l: Logger, r: TerritoryRepository) =>
      new TerritoriesFinder(l, r),
    inject: [Logger, TerritoryRepository],
  },
  {
    provide: TerritoryFinder,
    useFactory: (l: Logger, r: TerritoryRepository) =>
      new TerritoryFinder(l, r),
    inject: [Logger, TerritoryRepository],
  },
];

export const territoryQueryFactories: Provider[] = [
  ...handlersHelpersFactory,
  {
    provide: SearchAllTerritoryQueryHandler,
    useFactory: (f: TerritoriesFinder) => new SearchAllTerritoryQueryHandler(f),
    inject: [TerritoriesFinder],
  },
  {
    provide: FindByNumberQueryHandler,
    useFactory: (f: TerritoryFinder) => new FindByNumberQueryHandler(f),
    inject: [TerritoryFinder],
  },
];
