import { faker } from "@faker-js/faker";

import { TerritoryLastDateCompleted } from "@/contexts/Overseer/territories/domain/territory-last-date-completed";

export const TerritoryLastDateCompletedMother = {
  create(lastDateCompleted?: Date): TerritoryLastDateCompleted {
    return new TerritoryLastDateCompleted(
      lastDateCompleted ?? faker.date.past(),
    );
  },
};
