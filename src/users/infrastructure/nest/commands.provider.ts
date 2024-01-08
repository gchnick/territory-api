import { Provider } from '@nestjs/common';
import { EventBus } from '@shared/domain/event-bus';
import Logger from '@shared/domain/logger';
import { CreateUserCommandHandler } from '@users/application/create/creator-user-command-handler';
import { UserCreator } from '@users/application/create/user-creator';
import { UserRepository } from '@users/domain/user-repository';
import * as bcrypt from 'bcrypt';

const commandHelperFactories: Provider[] = [
  {
    provide: UserCreator,
    useFactory: (l: Logger, r: UserRepository, e: EventBus) =>
      new UserCreator(l, r, bcrypt, e),
    inject: [Logger, UserRepository, EventBus],
  },
];

export const userCommandFactories: Provider[] = [
  ...commandHelperFactories,
  {
    provide: CreateUserCommandHandler,
    useFactory: (c: UserCreator) => new CreateUserCommandHandler(c),
    inject: [UserCreator],
  },
];
