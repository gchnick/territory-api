import { Module } from '@nestjs/common';
import { NEST_TERRITORY_PROVIDERS } from '../dependencies/constants';
import { TerritoryPostController } from './territory-post.controller';

@Module({
  imports: [],
  controllers: [TerritoryPostController],
  providers: NEST_TERRITORY_PROVIDERS,
})
export class TerritoryModule {}
