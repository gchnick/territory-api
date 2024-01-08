import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { NEST_ROOT_EXPORTS, NEST_ROOT_PROVIDERS } from './providers';
@Module({
  imports: [ConfigModule, JwtModule],
  providers: [...NEST_ROOT_PROVIDERS, ConfigService, JwtService],
  exports: [...NEST_ROOT_EXPORTS, ConfigService, JwtService],
})
export class SharedModule {}
