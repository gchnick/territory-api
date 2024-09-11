import { faker } from "@faker-js/faker";

import { TerritoryQuantityHouse } from "@/contexts/Overseer/territories/domain/territory-quantity-house";

export const TerritoryQuantityHouseMother = {
  create(quantity?: number): TerritoryQuantityHouse {
    return new TerritoryQuantityHouse(
      quantity ?? faker.number.int({ min: 300, max: 1000 }),
    );
  },
};
