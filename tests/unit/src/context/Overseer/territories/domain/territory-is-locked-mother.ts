import { faker } from "@faker-js/faker";

import { TerritoryIsLocked } from "@/src/contexts/Overseer/territories/domain/territory-current-assigned";

export const TerritoryIsLockedMother = {
  create(isLocked?: boolean): TerritoryIsLocked {
    return new TerritoryIsLocked(isLocked ?? faker.datatype.boolean(0.75));
  },
};
