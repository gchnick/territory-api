import { Routes } from '@nestjs/core';

import { AuthModule } from '@auth/infrastructure/dependencies/nest/auth.module';
import { TerritoryModule } from '@territories/infrastructure/dependencies/nest/territory.module';

export default (): Routes => [
  { path: 'auth', module: AuthModule },
  { path: 'territories', module: TerritoryModule },
];
