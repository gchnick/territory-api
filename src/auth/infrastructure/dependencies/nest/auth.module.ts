import { Module, OnModuleInit } from '@nestjs/common';

import { SignInQueryHandler } from '@auth/application/sign-in/sign-in-query-handler';
import { SharedModule } from '@shared/infrastructure/dependencies/nest/shared.module';
import { QueryHandlers } from '@shared/infrastructure/query-bus/query-handlers';
import { UserModule } from '@users/infrastructure/nest/user.module';
import { AuthController } from '../../controllers/auth-post.controller';
import { NEST_AUTH_PROVIDERS } from './providers';

@Module({
  imports: [SharedModule, UserModule],
  controllers: [AuthController],
  providers: [...NEST_AUTH_PROVIDERS],
})
export class AuthModule implements OnModuleInit {
  constructor(
    private queryHandlers: QueryHandlers,
    private s: SignInQueryHandler,
  ) {}

  onModuleInit() {
    this.#addQueryHandlers();
  }

  #addQueryHandlers() {
    this.queryHandlers.add([this.s]);
  }
}
