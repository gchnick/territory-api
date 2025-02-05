import { faker } from "@faker-js/faker";

import { CongregationNumberOfTerritories } from "@/contexts/Overseer/congregations/domain/congregation-number-of-territories";

export const CongregationNumberOfTerritoriesMother = {
  create(quantity?: number) {
    return new CongregationNumberOfTerritories(
      quantity ?? faker.number.int({ min: 10, max: 99 }),
    );
  },
};
