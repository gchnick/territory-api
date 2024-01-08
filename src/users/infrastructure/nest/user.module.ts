import { Module, OnModuleInit } from '@nestjs/common';

import { CommandHandlers } from '@shared/infrastructure/command-bus/command-handlers';
import { SharedModule } from '@shared/infrastructure/dependencies/nest/shared.module';
import { QueryHandlers } from '@shared/infrastructure/query-bus/query-handlers';
import { CreateUserCommandHandler } from '@users/application/create/creator-user-command-handler';
import { FindByEmailQueryHandler } from '@users/application/find-by-email/find-by-email-query-handler';
import { UserRepository } from '@users/domain/user-repository';
import { NEST_USER_PROVIDERS } from './providers';

@Module({
  imports: [SharedModule],
  providers: [...NEST_USER_PROVIDERS],
  exports: [UserRepository],
})
export class UserModule implements OnModuleInit {
  constructor(
    private commandHandlers: CommandHandlers,
    private queryHandlers: QueryHandlers,
    private c: CreateUserCommandHandler,
    private f: FindByEmailQueryHandler,
  ) {}

  onModuleInit() {
    this.#addCommandHandlers();
    this.#addQueryHandlers();
  }

  #addCommandHandlers() {
    this.commandHandlers.add([this.c]);
  }

  #addQueryHandlers() {
    this.queryHandlers.add([this.f]);
  }
}
