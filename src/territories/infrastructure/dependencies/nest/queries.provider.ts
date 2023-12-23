import { Provider } from '@nestjs/common';
import { FindByNumberQueryHandler } from 'src/territories/application/find-by-number/find-by-number-query-handler';
import { TerritoryFinder } from 'src/territories/application/find-by-number/territory-finder';
import { SearchAllTerritoryQueryHandler } from 'src/territories/application/search-all/search-all-territories-query-handler';
import { TerritoriesFinder } from 'src/territories/application/search-all/territories-finder';
import { TerritoryRepository } from 'src/territories/domain/territory-repository';

const handlersHelpersFactory: Provider[] = [
  {
    provide: TerritoriesFinder,
    useFactory: (r: TerritoryRepository) => new TerritoriesFinder(r),
    inject: [TerritoryRepository],
  },
  {
    provide: TerritoryFinder,
    useFactory: (r: TerritoryRepository) => new TerritoryFinder(r),
    inject: [TerritoryRepository],
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
