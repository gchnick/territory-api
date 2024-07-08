import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { SharedModule } from "@/core/shared/shared.module";

import { CreateTerritoryCommandHandler } from "@/contexts/registry/territories/application/create/create-territory-command-handler";
import { TerritoryCreator } from "@/contexts/registry/territories/application/create/territory-creator";
import { ExistsByIdQueryHandler } from "@/contexts/registry/territories/application/exists/exists-by-id-query-handler";
import { TerritoryQuestioner } from "@/contexts/registry/territories/application/exists/territory-questioner";
import { FindByNumberQueryHandler } from "@/contexts/registry/territories/application/find-by-number/find-by-number-query-handler";
import { TerritoryFinder } from "@/contexts/registry/territories/application/find-by-number/territory-finder";
import { SearchAllTerritoryQueryHandler } from "@/contexts/registry/territories/application/search-all/search-all-territories-query-handler";
import { TerritoriesFinder } from "@/contexts/registry/territories/application/search-all/territories-finder";
import { SearchTerritoriesByCriteriaQueryHandler } from "@/contexts/registry/territories/application/search-by-criteria/search-territories-by-criteria-query-handler";
import { TerritoriesByCriteriaSearcher } from "@/contexts/registry/territories/application/search-by-criteria/territories-by-criteria-searcher";
import { TerritoryUpdater } from "@/contexts/registry/territories/application/update/territory-updater";
import { UpdateTerritoryCommandHandler } from "@/contexts/registry/territories/application/update/update-territory-command-handler";
import { TerritoryRepository } from "@/contexts/registry/territories/domain/territory-repository";
import { TerritoryTypeOrm } from "@/contexts/registry/territories/infrastructure/persistence/territory-type-orm";
import { TerritoryEntity } from "@/contexts/registry/territories/infrastructure/persistence/typeorm/territory-entity";

import { TerritoryDeleteController } from "./api/territory-delete.controller";
import { TerritoryGetController } from "./api/territory-get.controller";
import { TerritoryPatchController } from "./api/territory-patch.controller";
import { TerritoryPostController } from "./api/territory-post.controller";
import { TerritoryPutController } from "./api/territory-put.controller";

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([TerritoryEntity])],
  controllers: [
    TerritoryGetController,
    TerritoryPostController,
    TerritoryPutController,
    TerritoryPatchController,
    TerritoryDeleteController,
  ],
  providers: [
    {
      provide: TerritoryRepository,
      useFactory: (d: DataSource) => new TerritoryTypeOrm(d),
      inject: [DataSource],
    },
    TerritoryCreator,
    TerritoryUpdater,
    TerritoriesFinder,
    TerritoryFinder,
    TerritoryQuestioner,
    TerritoriesByCriteriaSearcher,
    CreateTerritoryCommandHandler,
    UpdateTerritoryCommandHandler,
    SearchAllTerritoryQueryHandler,
    FindByNumberQueryHandler,
    SearchTerritoriesByCriteriaQueryHandler,
    ExistsByIdQueryHandler,
    {
      provide: "TerritoryCommandHandlers",
      useFactory: (
        c: CreateTerritoryCommandHandler,
        u: UpdateTerritoryCommandHandler,
      ) => [c, u],
      inject: [CreateTerritoryCommandHandler, UpdateTerritoryCommandHandler],
    },
    {
      provide: "TerritoryQueryHandlers",
      useFactory: (
        s: SearchAllTerritoryQueryHandler,
        f: FindByNumberQueryHandler,
        c: SearchTerritoriesByCriteriaQueryHandler,
        q: ExistsByIdQueryHandler,
      ) => [s, f, c, q],
      inject: [
        SearchAllTerritoryQueryHandler,
        FindByNumberQueryHandler,
        SearchTerritoriesByCriteriaQueryHandler,
        ExistsByIdQueryHandler,
      ],
    },
  ],
  exports: ["TerritoryCommandHandlers", "TerritoryQueryHandlers"],
})
export class TerritoryModule {}
