import { faker } from "@faker-js/faker";

import { TerritoryNumber } from "@/contexts/registry/territories/domain/territory-number";

export const TerritoryNumberMother = {
  create(number?: number): TerritoryNumber {
    return new TerritoryNumber(
      number ?? faker.number.int({ min: 1, max: 100 }),
    );
  },
};
