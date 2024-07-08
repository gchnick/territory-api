import { faker } from "@faker-js/faker";

import { UserEmail } from "@/contexts/registry/users/domain/user-email";

export const UserEmailMother = {
  create(email?: string): UserEmail {
    return new UserEmail(email ?? faker.internet.email());
  },
};
