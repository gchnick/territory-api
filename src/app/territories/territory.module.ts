/* eslint-disable simple-import-sort/imports */
import { Inject, Module, OnModuleInit, Provider } from "@nestjs/common";
import { DataSource } from "typeorm";

import { SharedModule } from "@app/shared/shared.module";

import { CreateTerritoryCommandHandler } from "@contexts/registry/territories/application/create/create-territory-command-handler";
import { TerritoryCreator } from "@contexts/registry/territories/application/create/territory-creator";
import { FindByNumberQueryHandler } from "@contexts/registry/territories/application/find-by-number/find-by-number-query-handler";
import { TerritoryFinder } from "@contexts/registry/territories/application/find-by-number/territory-finder";
import { SearchAllTerritoryQueryHandler } from "@contexts/registry/territories/application/search-all/search-all-territories-query-handler";
import { TerritoriesFinder } from "@contexts/registry/territories/application/search-all/territories-finder";
import { TerritoryRepository } from "@contexts/registry/territories/domain/territory-repository";
import { TerritoryTypeorm } from "@contexts/registry/territories/infrastructure/persistence/typeorm/territory-typeorm";
import { Command } from "@contexts/shared/domain/command";
import { CommandHandler } from "@contexts/shared/domain/command-handler";
import { EventBus } from "@contexts/shared/domain/event-bus";
import Logger from "@contexts/shared/domain/logger";
import { Query } from "@contexts/shared/domain/query";
import { QueryHandler } from "@contexts/shared/domain/query-handler";
import { Response } from "@contexts/shared/domain/response";
import { CommandHandlers } from "@contexts/shared/infrastructure/command-bus/command-handlers";
import { QueryHandlers } from "@contexts/shared/infrastructure/query-bus/query-handlers";

import { TerritoryDeleteController } from "./api/territory-delete.controller";
import { TerritoriesGetController } from "./api/territory-get.controller";
import { TerritoryPostController } from "./api/territory-post.controller";

export const territoryProviders: Provider[] = [
  {
    provide: TerritoryRepository,
    useFactory: (l: Logger, d: DataSource) => new TerritoryTypeorm(l, d),
    inject: [Logger, DataSource],
  },
  {
    provide: TerritoryCreator,
    useFactory: (l: Logger, r: TerritoryRepository, e: EventBus) =>
      new TerritoryCreator(l, r, e),
    inject: [Logger, TerritoryRepository, EventBus],
  },
  {
    provide: CreateTerritoryCommandHandler,
    useFactory: (t: TerritoryCreator) => new CreateTerritoryCommandHandler(t),
    inject: [TerritoryCreator],
  },
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
  {
    provide: "TerritoyCommandHandlers",
    useFactory: (c: CreateTerritoryCommandHandler) => [c],
    inject: [CreateTerritoryCommandHandler],
  },
  {
    provide: "TerritoyQueryHandlers",
    useFactory: (
      s: SearchAllTerritoryQueryHandler,
      f: FindByNumberQueryHandler,
    ) => [s, f],
    inject: [SearchAllTerritoryQueryHandler, FindByNumberQueryHandler],
  },
];

@Module({
  imports: [SharedModule],
  controllers: [
    TerritoriesGetController,
    TerritoryPostController,
    TerritoryDeleteController,
  ],
  providers: [...territoryProviders],
})
export class TerritoryModule implements OnModuleInit {
  constructor(
    private commandHandlers: CommandHandlers,
    private queryHandlers: QueryHandlers,
    @Inject("TerritoyCommandHandlers")
    private commandHandler: Array<CommandHandler<Command>>,
    @Inject("TerritoyQueryHandlers")
    private queryHandler: Array<QueryHandler<Query, Response>>,
  ) {}

  onModuleInit() {
    this.#addCommandHandlers();
    this.#addQueryHandlers();
  }

  #addCommandHandlers() {
    this.commandHandlers.add(this.commandHandler);
  }

  #addQueryHandlers() {
    this.queryHandlers.add(this.queryHandler);
  }
}
