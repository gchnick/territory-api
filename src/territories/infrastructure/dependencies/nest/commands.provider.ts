import { Provider } from '@nestjs/common';
import { EventBus } from '@shared/domain/event-bus';
import { CreateTerritoryCommandHandler } from '@territories/application/create/create-territory-command-handler';
import { TerritoryCreator } from '@territories/application/create/territory-creator';
import { TerritoryRepository } from '@territories/domain/territory-repository';

const commandHelperFactories: Provider[] = [
  {
    provide: TerritoryCreator,
    useFactory: (r: TerritoryRepository, e: EventBus) =>
      new TerritoryCreator(r, e),
    inject: [TerritoryRepository, EventBus],
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
