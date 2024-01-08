import { AuthChecker } from '@auth/application/sign-in/auth-checker';
import { SignInQueryHandler } from '@auth/application/sign-in/sign-in-query-handler';
import { Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Logger from '@shared/domain/logger';
import { UserRepository } from '@users/domain/user-repository';
import * as bcrypt from 'bcrypt';

const queryHelperFactory: Provider = {
  provide: AuthChecker,
  useFactory: (l: Logger, r: UserRepository, j: JwtService) =>
    new AuthChecker(l, r, bcrypt, j),
  inject: [Logger, UserRepository, JwtService],
};

export const NEST_AUTH_PROVIDERS: Provider[] = [
  queryHelperFactory,
  {
    provide: SignInQueryHandler,
    useFactory: (a: AuthChecker) => new SignInQueryHandler(a),
    inject: [AuthChecker],
  },
];
