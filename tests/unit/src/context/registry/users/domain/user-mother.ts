import { CreateUserCommand } from "@/contexts/registry/users/application/create/create-user.command";
import { FindByEmailQuery } from "@/contexts/registry/users/application/find-by-email/find-by-email-query";
import { RoleName } from "@/contexts/registry/users/domain/role/role-name";
import { User, UserPrimitives } from "@/contexts/registry/users/domain/user";

import { UserEmailMother } from "./user-email-mother";
import { UserEnabledMother } from "./user-enabled-mother";
import { UserIdMother } from "./user-id-mother";
import { UserNameMother } from "./user-name-mother";
import { UserPasswordMother } from "./user-password-mother";
import { UserRoleMother } from "./user-role-mother";
import { UserVerifedMother } from "./user-verified-mother";

export const UserMother = {
  create(params?: Partial<UserPrimitives>): User {
    const primitives: UserPrimitives = {
      id: UserIdMother.create().value,
      name: UserNameMother.create().value,
      email: UserEmailMother.create().value,
      password: UserPasswordMother.create().value,
      verified: UserVerifedMother.create(true).value,
      enabled: UserEnabledMother.create(true).value,
      roles: [UserRoleMother.create().toPrimitives()],
      ...params,
    };

    return User.fromPrimitive(primitives);
  },
  fromCommand(command: CreateUserCommand): User {
    const { id, name, email, password, roles } = command;
    return this.create({
      id,
      name,
      email,
      password,
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
