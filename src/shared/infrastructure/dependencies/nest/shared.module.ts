import { Module } from '@nestjs/common';
import { NEST_ROOT_EXPORTS, NEST_ROOT_PROVIDERS } from '../providers';

@Module({
  providers: [...NEST_ROOT_PROVIDERS],
  exports: [...NEST_ROOT_EXPORTS],
})
export class SharedModule {}
