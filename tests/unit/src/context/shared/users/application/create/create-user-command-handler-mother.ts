import { CreateUserCommand } from "@/src/contexts/shared/users/application/create/create-user.command";
import { Role } from "@/src/contexts/shared/users/domain/role/role-name";

import { UserEmailMother } from "../../domain/user-email-mother";
import { UserIdMother } from "../../domain/user-id-mother";
import { UserNameMother } from "../../domain/user-name-mother";
import { UserPasswordMother } from "../../domain/user-password-mother";

type Params = {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: string[];
};

export const CreateUserCommandMother = {
  create(params?: Partial<Params>): CreateUserCommand {
    const primitives: Params = {
      id: UserIdMother.create().value,
      name: UserNameMother.create().value,
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
