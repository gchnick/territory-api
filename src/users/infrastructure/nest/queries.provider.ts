import { Provider } from '@nestjs/common';
import Logger from '@shared/domain/logger';
import { FindByEmailQueryHandler } from '@users/application/find-by-email/find-by-email-query-handler';
import { UserFinder } from '@users/application/find-by-email/user-finder';
import { UserRepository } from '@users/domain/user-repository';

const queryHelperFactories: Provider[] = [
  {
    provide: UserFinder,
    useFactory: (l: Logger, r: UserRepository) => new UserFinder(l, r),
    inject: [Logger, UserRepository],
  },
];

export const userQueryFactories: Provider[] = [
  ...queryHelperFactories,
  {
    provide: FindByEmailQueryHandler,
    useFactory: (f: UserFinder) => new FindByEmailQueryHandler(f),
    inject: [UserFinder],
  },
];
