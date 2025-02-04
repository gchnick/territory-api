import { Nullable } from "@/shared/domain/nullable";

import { RoleName } from "./role/role-name";
import { User, UserPrimitives } from "./user";
import { UserEmail } from "./user-email";
import { UserId } from "./user-id";
import { UserRole } from "./user-role";

export type PartialUserPrimitive = Partial<Omit<UserPrimitives, "id">>;

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;

  abstract findByEmail(email: UserEmail): Promise<Nullable<User>>;

  abstract findById(id: UserId): Promise<Nullable<User>>;

  abstract findRole(name: RoleName): Promise<Nullable<UserRole>>;

  abstract saveRole(role: UserRole): Promise<void>;

  abstract update(id: UserId, data: PartialUserPrimitive): Promise<void>;

  abstract deleteAllRoles(): Promise<void>;

  abstract deleteAll(): Promise<void>;
}
