import { Query } from '@shared/domain/query';
import { QueryHandler } from '@shared/domain/query-handler';
import { UserEmail } from '@users/domain/user-email';
import { UserPassword } from '@users/domain/user-password';
import { AuthChecker } from './auth-checker';
import { AuthResponse } from './auth-response';
import { SignInQuery } from './sign-in-query';

export class SignInQueryHandler
  implements QueryHandler<SignInQuery, AuthResponse>
{
  constructor(private authChecker: AuthChecker) {}

  subscribedTo(): Query {
    return SignInQuery;
  }

  async handle(query: SignInQuery): Promise<AuthResponse> {
    const email = new UserEmail(query.email);
    const password = new UserPassword(query.password);
    return await this.authChecker.run(email, password);
  }
}
