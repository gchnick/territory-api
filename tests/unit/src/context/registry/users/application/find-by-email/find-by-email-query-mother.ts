import { faker } from "@faker-js/faker";

import { FindByEmailQuery } from "@/contexts/registry/users/application/find-by-email/find-by-email-query";

export const FindByEmailQueryMother = {
  create(email?: string): FindByEmailQuery {
    return new FindByEmailQuery(email ?? faker.internet.email());
  },
};
