import { faker } from "@faker-js/faker";

import { TerritoryQuantityHouse } from "@/contexts/Overseer/territories/domain/territory-quantity-house";

const min = TerritoryQuantityHouse.MINIMUM_HOUSE_PER_TERRITORY;
const max = TerritoryQuantityHouse.MAXIMUM_HOUSE_PER_TERRITORY;

export const TerritoryQuantityHouseMother = {
  create(quantity?: number): TerritoryQuantityHouse {
    return new TerritoryQuantityHouse(
      quantity ?? faker.number.int({ min, max }),
    );
  },
};
