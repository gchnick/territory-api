import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from '@auth/infrastructure/dependencies/nest/auth.module';
import { TerritoryModule } from '@territories/infrastructure/dependencies/nest/territory.module';
import { UserModule } from '@users/infrastructure/nest/user.module';
import configOptions from './config/config-options';
import jwtAsyncOptions from './config/jwt-async-options';
import routes from './config/routes';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions()),
    JwtModule.registerAsync(jwtAsyncOptions()),
    AuthModule,
    UserModule,
    TerritoryModule,
    RouterModule.register(routes()),
  ],
})
export class AppModule {}
