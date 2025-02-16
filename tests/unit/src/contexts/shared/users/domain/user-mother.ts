import type { UserPrimitives } from "@/contexts/shared/users/domain/user";

import { CreateUserCommand } from "@/contexts/shared/users/application/create/create-user.command";
import { FindByEmailQuery } from "@/contexts/shared/users/application/find-by-email/find-by-email-query";
import { RoleName } from "@/contexts/shared/users/domain/role/role-name";
import { User } from "@/contexts/shared/users/domain/user";

import { UserEmailMother } from "./user-email-mother";
import { UserEnabledMother } from "./user-enabled-mother";
import { UserIdMother } from "./user-id-mother";
import { UserPasswordMother } from "./user-password-mother";
import { UserRoleMother } from "./user-role-mother";
import { UserVerifiedMother } from "./user-verified-mother";

export const UserMother = {
  create(params?: Partial<UserPrimitives>): User {
    const primitives: UserPrimitives = {
      id: UserIdMother.create().value,
      email: UserEmailMother.create().value,
      password: UserPasswordMother.create().value,
      verified: UserVerifiedMother.create().value,
      enabled: UserEnabledMother.create().value,
      roles: [UserRoleMother.create().toPrimitives()],
      ...params,
    };

    return User.fromPrimitives(primitives);
  },
  fromCommand(command: CreateUserCommand): User {
    const { id, email, password, roles } = command;
    return this.create({
      id,
      email,
      password,
      enabled: true,
      verified: false,
      roles: roles.map(r =>
        UserRoleMother.create({
          name: RoleName.fromValue(r).value,
        }).toPrimitives(),
      ),
    });
  },
  fromQuery(query: FindByEmailQuery): User {
    const { email } = query;
    return this.create({ email });
  },
};
