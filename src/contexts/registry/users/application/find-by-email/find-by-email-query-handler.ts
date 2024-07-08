import { UserEmail } from "@/contexts/registry/users/domain/user-email";
import { Query } from "@/contexts/shared/domain/query";
import { QueryHandler } from "@/contexts/shared/domain/query-handler";
import { Injectable } from "@/contexts/shared/infrastructure/dependency-injection/injectable";

import { FindByEmailQuery } from "./find-by-email-query";
import { UserFinder } from "./user-finder";
import { UserResponse } from "./user-response";

@Injectable()
export class FindByEmailQueryHandler
  implements QueryHandler<FindByEmailQuery, UserResponse>
{
  constructor(private readonly userFinder: UserFinder) {}

  subscribedTo(): Query {
    return FindByEmailQuery;
  }

  async handle(query: FindByEmailQuery): Promise<UserResponse> {
    const email = new UserEmail(query.email);
    return await this.userFinder.find(email);
  }
}
