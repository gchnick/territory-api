import { faker } from "@faker-js/faker";

import { UserEnabled } from "@/contexts/registry/users/domain/user-enabled";

export const UserEnabledMother = {
  create(value?: boolean): UserEnabled {
    return new UserEnabled(value ?? faker.datatype.boolean(0.75));
  },
};
