import { faker } from "@faker-js/faker";

import { RoleId } from "@/contexts/shared/users/domain/role/role-id";

export const RoleIdMother = {
  create(id?: number): RoleId {
    return new RoleId(id ?? faker.number.int({ min: 0, max: 999 }));
  },
};
