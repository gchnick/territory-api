import { faker } from "@faker-js/faker";

import { TerritoryId } from "@contexts/registry/territories/domain/territory-id";

export const TerritoryIdMother = {
  create(value?: string): TerritoryId {
    return new TerritoryId(value ?? faker.string.uuid());
  },
};
