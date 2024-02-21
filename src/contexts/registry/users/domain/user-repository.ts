import { User } from "./user";
import { UserEmail } from "./user-email";

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findOne(email: UserEmail): Promise<User | undefined>;
}
