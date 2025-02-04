import { RolesMother } from "@/tests/unit/src/contexts/shared/users/domain/role/role-name-mother";
import { UserEmailMother } from "@/tests/unit/src/contexts/shared/users/domain/user-email-mother";
import { UserPasswordMother } from "@/tests/unit/src/contexts/shared/users/domain/user-password-mother";

export const SignupPostRequestMother = {
  create({
    email = UserEmailMother.create().value,
    password = UserPasswordMother.create().value,
    roles = RolesMother.create(),
  } = {}) {
    return {
      email,
      password,
      roles,
    };
  },
};
