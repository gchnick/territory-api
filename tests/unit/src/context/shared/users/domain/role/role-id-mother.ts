import { faker } from "@faker-js/faker";

import { RoleId } from "@/src/contexts/shared/users/domain/role/role-id";

export const RoleIdMother = {
  create(id?: string): RoleId {
    return new RoleId(id ?? faker.string.uuid.toString());
  },
};
