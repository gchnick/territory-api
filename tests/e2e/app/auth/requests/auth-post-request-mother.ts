import { faker } from "@faker-js/faker";

export const AuthPostRequestMother = {
  create({
    email = faker.internet.email(),
    password = faker.internet.password(),
  } = {}) {
    return {
      email,
      password,
    };
  },
};
