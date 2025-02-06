import { UserEmailMother } from "@/tests/unit/src/contexts/shared/users/domain/user-email-mother";
import { UserIdMother } from "@/tests/unit/src/contexts/shared/users/domain/user-id-mother";
import { UserPasswordMother } from "@/tests/unit/src/contexts/shared/users/domain/user-password-mother";

import { CreateUserCommand } from "@/contexts/shared/users/application/create/create-user.command";
import { Role } from "@/contexts/shared/users/domain/role/role-name";

interface Params {
  id: string;
  email: string;
  password: string;
  roles: string[];
}

export const CreateUserCommandMother = {
  create(params?: Partial<Params>): CreateUserCommand {
    const primitives: Params = {
      id: UserIdMother.create().value,
      email: UserEmailMother.create().value,
      password: UserPasswordMother.create().value,
      roles: [Role.SERVICE_OVERSEER],
      ...params,
    };
    return new CreateUserCommand(primitives);
  },
  invalidRoles(): CreateUserCommand {
    const roles = ["INVALID_ROLE"];
    return this.create({ roles });
  },
};
