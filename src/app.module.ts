import { Module } from '@nestjs/common';
import { NEST_ROOT_PROVIDERS } from './shared/infrastructure/dependencies/constants';
import { TerritoryModule } from './territories/infrastructure/controllers/territory.module';

@Module({
  imports: [TerritoryModule],
  controllers: [],
  providers: NEST_ROOT_PROVIDERS,
})
export class AppModule {}
