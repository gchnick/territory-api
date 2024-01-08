import { Provider } from '@nestjs/common';
import { UserRepository } from '@users/domain/user-repository';
import { UserTypeormSqlite } from '../persistence/typeorm/user-typeorm-sqlite';
import { userCommandFactories } from './commands.provider';
import { userQueryFactories } from './queries.provider';

export const NEST_USER_PROVIDERS: Provider[] = [
  { provide: UserRepository, useClass: UserTypeormSqlite },
  ...userCommandFactories,
  ...userQueryFactories,
];
