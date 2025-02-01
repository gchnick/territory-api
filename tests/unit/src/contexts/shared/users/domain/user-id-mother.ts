import { faker } from "@faker-js/faker";

import { UserId } from "@/src/contexts/shared/users/domain/user-id";

export const UserIdMother = {
  create(id?: string): UserId {
    return new UserId(id ?? faker.string.uuid.toString());
  },
};
