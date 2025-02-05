import { faker } from "@faker-js/faker";

import { TerritorySector } from "@/contexts/Overseer/territories/domain/territory-sector";

export const TerritorySectorMother = {
  create(sector?: string): TerritorySector {
    return new TerritorySector(sector ?? faker.location.city());
  },
};
