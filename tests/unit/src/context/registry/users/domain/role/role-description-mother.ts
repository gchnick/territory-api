import { faker } from "@faker-js/faker";

import { RoleDescription } from "@/contexts/registry/users/domain/role/role-description";

export const RoleDescriptionMother = {
  create(description?: string): RoleDescription {
    return new RoleDescription(
      description ?? faker.company.catchPhraseDescriptor(),
    );
  },
};
