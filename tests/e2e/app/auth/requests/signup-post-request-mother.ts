import { faker } from "@faker-js/faker";

import { Role } from "@/contexts/registry/users/domain/role/role-name";

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
