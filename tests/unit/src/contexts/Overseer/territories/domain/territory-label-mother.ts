import { faker } from "@faker-js/faker";

import { TerritoryLabel } from "@/contexts/Overseer/territories/domain/territory-label";

export const TerritoryLabelMother = {
  create(value?: string): TerritoryLabel {
    return new TerritoryLabel(value ?? faker.location.city());
  },
  invalid(): string {
    const exceeded = TerritoryLabel.MAXIMUM_CHARACTERS + 20;
    return faker.string.alpha({
      length: { min: exceeded, max: exceeded + 50 },
    });
  },
};
