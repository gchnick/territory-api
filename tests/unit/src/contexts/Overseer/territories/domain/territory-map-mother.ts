import { faker } from "@faker-js/faker";

import { TerritoryMap } from "@/contexts/Overseer/territories/domain/territory-map";

export const TerritoryMapMother = {
  create(urlMap?: string): TerritoryMap {
    return new TerritoryMap(urlMap ?? faker.image.url());
  },
};
