import { User } from './user';
import { UserEmail } from './user-email';
import { UserId } from './user-id';

export abstract class UserRepository {
  abstract save(user: User): Promise<UserId>;
  abstract findOne(email: UserEmail): Promise<User | undefined>;
}
