import { faker } from "@faker-js/faker";

import { RoleId } from "@/contexts/registry/users/domain/role/role-id";

export const RoleIdMother = {
  create(id?: string): RoleId {
    return new RoleId(id ?? faker.string.uuid.toString());
  },
};
