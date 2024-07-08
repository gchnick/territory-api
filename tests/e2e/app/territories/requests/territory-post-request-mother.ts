import { faker } from "@faker-js/faker";

import { TerritoryLocalityMother } from "../../../../unit/src/context/registry/territories/domain/territory-locality-mother";

export const TerritoryPostRequestMother = {
  create({
    number = faker.number.int({ min: 1, max: 100 }),
    label = faker.location.city(),
    sector = faker.location.city(),
    locality = TerritoryLocalityMother.locality(),
    localityInPart = TerritoryLocalityMother.locality(),
    quantityHouses = faker.number.int({ min: 300, max: 1000 }),
    lastDateCompleted = faker.date.past().toISOString(),
  } = {}) {
    return {
      number,
      label,
      sector,
      locality,
      localityInPart,
      quantityHouses,
      lastDateCompleted,
    };
  },
};
