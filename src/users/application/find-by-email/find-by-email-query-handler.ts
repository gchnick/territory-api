import { Query } from '@shared/domain/query';
import { QueryHandler } from '@shared/domain/query-handler';
import { UserEmail } from '@users/domain/user-email';
import { FindByEmailQuery } from './find-by-email-query';
import { UserFinder } from './user-finder';
import { UserResponse } from './user-response';

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
