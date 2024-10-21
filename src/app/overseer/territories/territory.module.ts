import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { AuthModule } from "@/app/shared/auth/auth.module";

import { MeetingPlaceAvailability } from "@/contexts/Overseer/meeting-place/domain/meeting-place-availability";
import { AvailabilityEntity } from "@/contexts/Overseer/meeting-place/infrastructure/persistence/typeorm/availability-entity";
import { MeetingPlaceEntity } from "@/contexts/Overseer/meeting-place/infrastructure/persistence/typeorm/meeting-place-entity";
import { CreateTerritoryCommandHandler } from "@/contexts/Overseer/territories/application/create/create-territory-command-handler";
import { TerritoryCreator } from "@/contexts/Overseer/territories/application/create/territory-creator";
import { ExistsByIdQueryHandler } from "@/contexts/Overseer/territories/application/exists/exists-by-id-query-handler";
import { TerritoryQuestioner } from "@/contexts/Overseer/territories/application/exists/territory-questioner";
import { FindByNumberQueryHandler } from "@/contexts/Overseer/territories/application/find-by-number/find-by-number-query-handler";
import { TerritoryFinder } from "@/contexts/Overseer/territories/application/find-by-number/territory-finder";
import { SearchAllTerritoryQueryHandler } from "@/contexts/Overseer/territories/application/search-all/search-all-territories-query-handler";
import { TerritoriesFinder } from "@/contexts/Overseer/territories/application/search-all/territories-finder";
import { SearchTerritoriesByCriteriaQueryHandler } from "@/contexts/Overseer/territories/application/search-by-criteria/search-territories-by-criteria-query-handler";
import { TerritoriesByCriteriaSearcher } from "@/contexts/Overseer/territories/application/search-by-criteria/territories-by-criteria-searcher";
import { TerritoryUpdater } from "@/contexts/Overseer/territories/application/update/territory-updater";
import { UpdateTerritoryCommandHandler } from "@/contexts/Overseer/territories/application/update/update-territory-command-handler";
import { TerritoryRepository } from "@/contexts/Overseer/territories/domain/territory-repository";
import { TerritoryTypeOrm } from "@/contexts/Overseer/territories/infrastructure/persistence/territory-type-orm";
import { TerritoryEntity } from "@/contexts/Overseer/territories/infrastructure/persistence/typeorm/territory-entity";

import { TerritoryDeleteController } from "./api/territory-delete.controller";
import { TerritoryGetController } from "./api/territory-get.controller";
import { TerritoryPatchController } from "./api/territory-patch.controller";
import { TerritoryPostController } from "./api/territory-post.controller";
import { TerritoryPutController } from "./api/territory-put.controller";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      TerritoryEntity,
      MeetingPlaceEntity,
      MeetingPlaceAvailability,
      AvailabilityEntity,
    ]),
  ],
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
      useFactory: (d: DataSource, c: ConfigService) =>
        new TerritoryTypeOrm(d, c),
      inject: [DataSource, ConfigService],
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
