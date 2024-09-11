import { faker } from "@faker-js/faker";

import { UserEmail } from "@/src/contexts/shared/users/domain/user-email";

export const UserEmailMother = {
  create(email?: string): UserEmail {
    return new UserEmail(email ?? faker.internet.email());
  },
};
