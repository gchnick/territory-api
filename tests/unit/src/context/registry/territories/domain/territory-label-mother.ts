import { faker } from "@faker-js/faker";

import { TerritoryLabel } from "@contexts/registry/territories/domain/territory-label";

export const TerritoryLabelMother = {
  create(value?: string): TerritoryLabel {
    return new TerritoryLabel(value ?? faker.location.city());
  },
  invalid(): TerritoryLabel {
    return new TerritoryLabel(faker.string.alpha(55));
  },
};
