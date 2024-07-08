import { DeepPartial } from "@/contexts/shared/domain/deep-partial";
import { Nullable } from "@/contexts/shared/domain/nullable";

import { RoleName } from "./role/role-name";
import { User } from "./user";
import { UserEmail } from "./user-email";
import { UserId } from "./user-id";
import { UserRole } from "./user-role";

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;

  abstract findByEmail(email: UserEmail): Promise<Nullable<User>>;

  abstract findById(id: UserId): Promise<Nullable<User>>;

  abstract findRole(name: RoleName): Promise<Nullable<UserRole>>;

  abstract saveRole(role: UserRole): Promise<void>;

  abstract update(id: UserId, data: DeepPartial<User>): Promise<void>;

  abstract update(id: UserId, data: User): Promise<void>;

  abstract deleteAll(): Promise<void>;
}
