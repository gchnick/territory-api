import { TerritoryRepository } from 'src/territories/domain/territory-repository';
import { TerritoryPrimaSqlite } from '../persistence/prisma/territory-prisma-sqlite';

export const NEST_TERRITORY_PROVIDERS = [
  { provide: TerritoryRepository, useClass: TerritoryPrimaSqlite },
];
