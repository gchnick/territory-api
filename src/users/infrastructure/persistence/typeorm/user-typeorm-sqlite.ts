import { User } from '@users/domain/user';
import { UserEmail } from '@users/domain/user-email';
import { UserId } from '@users/domain/user-id';
import { UserRepository } from '@users/domain/user-repository';

export class UserTypeormSqlite extends UserRepository {
  save(user: User): Promise<UserId> {
    throw new Error('Method not implemented.');
  }
  findOne(email: UserEmail): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
