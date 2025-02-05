import { faker } from "@faker-js/faker";

import { TerritoryCurrentAssigned } from "@/contexts/Overseer/territories/domain/territory-current-assigned";

export const TerritoryCurrentAssignedMother = {
  create(isAssigned?: boolean): TerritoryCurrentAssigned {
    return new TerritoryCurrentAssigned(
      isAssigned ?? faker.datatype.boolean(0.75),
    );
  },
};
