import { faker } from "@faker-js/faker";

import { UserVerified } from "@/contexts/registry/users/domain/user-verified";

export const UserVerifedMother = {
  create(value?: boolean): UserVerified {
    return new UserVerified(value ?? faker.datatype.boolean(0.75));
  },
};
