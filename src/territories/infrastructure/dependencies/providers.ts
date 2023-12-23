import { Provider } from '@nestjs/common';
import { TerritoryRepository } from 'src/territories/domain/territory-repository';
import { TerritoryPrimaSqlite } from '../persistence/prisma/territory-prisma-sqlite';
import { territoryCommandFactories } from './commands.provider';
import { territoryQueryFactories } from './queries.provider';

export const NEST_TERRITORY_PROVIDERS: Provider[] = [
  { provide: TerritoryRepository, useClass: TerritoryPrimaSqlite },
  ...territoryCommandFactories,
  ...territoryQueryFactories,
];
