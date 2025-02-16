import { faker } from "@faker-js/faker";

import { UserVerified } from "@/contexts/shared/users/domain/user-verified";

export const UserVerifiedMother = {
  create(value?: boolean): UserVerified {
    return new UserVerified(value ?? faker.datatype.boolean(0.75));
  },
};
