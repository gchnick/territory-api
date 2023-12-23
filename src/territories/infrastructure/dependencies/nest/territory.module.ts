import { Module, OnModuleInit } from '@nestjs/common';
import { CommandHandlers } from 'src/shared/infrastructure/command-bus/command-handlers';
import { SharedModule } from 'src/shared/infrastructure/dependencies/nest/shared.module';
import { QueryHandlers } from 'src/shared/infrastructure/query-bus/query-handlers';
import { CreateTerritoryCommandHandler } from 'src/territories/application/create/create-territory-command-handler';
import { FindByNumberQueryHandler } from 'src/territories/application/find-by-number/find-by-number-query-handler';
import { SearchAllTerritoryQueryHandler } from 'src/territories/application/search-all/search-all-territories-query-handler';
import { TerritoriesGetController } from '../../controllers/territories-get-controller';
import { TerritoryPostController } from '../../controllers/territory-post.controller';
import { NEST_TERRITORY_PROVIDERS } from './providers';

@Module({
  imports: [SharedModule],
  controllers: [TerritoriesGetController, TerritoryPostController],
  providers: [...NEST_TERRITORY_PROVIDERS],
})
export class TerritoryModule implements OnModuleInit {
  constructor(
    private commandHandlers: CommandHandlers,
    private queryHandlers: QueryHandlers,
    private c: CreateTerritoryCommandHandler,
    private s: SearchAllTerritoryQueryHandler,
    private f: FindByNumberQueryHandler,
  ) {}

  onModuleInit() {
    this.#addCommandHandlers();
    this.#addQueryHandlers();
  }

  #addCommandHandlers() {
    this.commandHandlers.add([this.c]);
  }

  #addQueryHandlers() {
    this.queryHandlers.add([this.s, this.f]);
  }
}
