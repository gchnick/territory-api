import { faker } from "@faker-js/faker";

import { TerritoryLocality } from "@/contexts/Overseer/territories/domain/territory-locality";

export const TerritoryLocalityMother = {
  create(locality?: string): TerritoryLocality {
    return new TerritoryLocality(locality ?? this.locality());
  },
  locality(): string {
    return `${faker.location.secondaryAddress()}, ${faker.location.secondaryAddress()}, ${faker.location.secondaryAddress()}`;
  },
};
