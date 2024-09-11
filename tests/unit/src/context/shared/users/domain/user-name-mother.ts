import { faker } from "@faker-js/faker";

import { UserName } from "@/src/contexts/shared/users/domain/user-name";

export const UserNameMother = {
  create(name?: string): UserName {
    return new UserName(name ?? faker.person.fullName());
  },
};
