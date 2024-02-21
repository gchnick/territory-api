import { faker } from "@faker-js/faker";

import { TerritoryIsLocked } from "@src/contexts/registry/territories/domain/territory-is-locked";

export const TerritoryIsLockedMother = {
  create(isLocked?: boolean): TerritoryIsLocked {
    return new TerritoryIsLocked(isLocked ?? faker.datatype.boolean(0.75));
  },
};
