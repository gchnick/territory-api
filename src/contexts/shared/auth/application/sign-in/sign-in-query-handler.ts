import { Query } from "@/shared/domain/query";
import { QueryHandler } from "@/shared/domain/query-handler";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { UserEmail } from "@/contexts/shared/users/domain/user-email";
import { UserPassword } from "@/contexts/shared/users/domain/user-password";

import { AuthChecker } from "./auth-checker";
import { AuthResponse } from "./auth-response";
import { SignInQuery } from "./sign-in-query";

@Injectable()
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
    return this.authChecker.check(email, password);
  }
}
