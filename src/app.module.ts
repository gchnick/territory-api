import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TerritoryModule } from './territories/infrastructure/controllers/territory.module';

@Module({
  imports: [
    TerritoryModule,
    RouterModule.register([{ path: 'territories', module: TerritoryModule }]),
  ],
})
export class AppModule {}
