import { faker } from "@faker-js/faker";

import { UserPassword } from "@/contexts/shared/users/domain/user-password";

export const UserPasswordMother = {
  create(password?: string): UserPassword {
    return new UserPassword(password ?? faker.internet.password());
  },
};
