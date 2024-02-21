/* eslint-disable simple-import-sort/imports */
import { Module, OnModuleInit, Provider } from "@nestjs/common";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";

import { SharedModule } from "@app/shared/shared.module";

import { CreateUserCommandHandler } from "@contexts/registry/users/application/create/creator-user-command-handler";
import { UserCreator } from "@contexts/registry/users/application/create/user-creator";
import { FindByEmailQueryHandler } from "@contexts/registry/users/application/find-by-email/find-by-email-query-handler";
import { UserFinder } from "@contexts/registry/users/application/find-by-email/user-finder";
import { UserRepository } from "@contexts/registry/users/domain/user-repository";
import { Role } from "@contexts/registry/users/infrastructure/persistence/typeorm/role.entity";
import { UserTypeormSqlite } from "@contexts/registry/users/infrastructure/persistence/typeorm/user-typeorm-sqlite";
import { User } from "@contexts/registry/users/infrastructure/persistence/typeorm/user.entity";
import { EventBus } from "@contexts/shared/domain/event-bus";
import Logger from "@contexts/shared/domain/logger";
import { CommandHandlers } from "@contexts/shared/infrastructure/command-bus/command-handlers";
import { QueryHandlers } from "@contexts/shared/infrastructure/query-bus/query-handlers";

const USER_PROVIDERS: Provider[] = [
  {
    provide: UserRepository,
    useFactory: (r: Repository<User>) => new UserTypeormSqlite(r),
    inject: [getRepositoryToken(User)],
  },
  {
    provide: UserCreator,
    useFactory: (l: Logger, r: UserRepository, e: EventBus) =>
      new UserCreator(l, r, bcrypt, e),
    inject: [Logger, UserRepository, EventBus],
  },
  {
    provide: CreateUserCommandHandler,
    useFactory: (c: UserCreator) => new CreateUserCommandHandler(c),
    inject: [UserCreator],
  },
  {
    provide: UserFinder,
    useFactory: (l: Logger, r: UserRepository) => new UserFinder(l, r),
    inject: [Logger, UserRepository],
  },
  {
    provide: FindByEmailQueryHandler,
    useFactory: (f: UserFinder) => new FindByEmailQueryHandler(f),
    inject: [UserFinder],
  },
];

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([User, Role])],
  providers: [...USER_PROVIDERS],
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
