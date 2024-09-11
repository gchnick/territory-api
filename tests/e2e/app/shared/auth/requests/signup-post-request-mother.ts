import { faker } from "@faker-js/faker";

import { Role } from "@/src/contexts/shared/users/domain/role/role-name";

export const SignupPostRequestMother = {
  create({
    name = faker.person.fullName(),
    email = faker.internet.email(),
    password = faker.internet.password(),
    roles = Object.keys(Role),
  } = {}) {
    return {
      name,
      email,
      password,
      roles,
    };
  },
};
