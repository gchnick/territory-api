import { UserEmail } from "@contexts/registry/users/domain/user-email";
import { Query } from "@contexts/shared/domain/query";
import { QueryHandler } from "@contexts/shared/domain/query-handler";

import { FindByEmailQuery } from "./find-by-email-query";
import { UserFinder } from "./user-finder";
import { UserResponse } from "./user-response";

export class FindByEmailQueryHandler
  implements QueryHandler<FindByEmailQuery, UserResponse>
{
  constructor(private userFinder: UserFinder) {}

  subscribedTo(): Query {
    return FindByEmailQuery;
  }

  async handle(query: FindByEmailQuery): Promise<UserResponse> {
    const email = new UserEmail(query.email);
    return await this.userFinder.run(email);
  }
}
