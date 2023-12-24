import { Provider } from '@nestjs/common';
import { EventBus } from '@shared/domain/event-bus';
import Logger from '@shared/domain/logger';
import { CreateTerritoryCommandHandler } from '@territories/application/create/create-territory-command-handler';
import { TerritoryCreator } from '@territories/application/create/territory-creator';
import { TerritoryRepository } from '@territories/domain/territory-repository';

const commandHelperFactories: Provider[] = [
  {
    provide: TerritoryCreator,
    useFactory: (l: Logger, r: TerritoryRepository, e: EventBus) =>
      new TerritoryCreator(l, r, e),
    inject: [Logger, TerritoryRepository, EventBus],
  },
];

export const territoryCommandFactories: Provider[] = [
  ...commandHelperFactories,
  {
    provide: CreateTerritoryCommandHandler,
    useFactory: (t: TerritoryCreator) => new CreateTerritoryCommandHandler(t),
    inject: [TerritoryCreator],
  },
];
