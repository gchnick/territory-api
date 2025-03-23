import { faker } from "@faker-js/faker";
import { Temporal } from "temporal-polyfill";

import { TerritoryLastDateCompleted } from "@/contexts/Overseer/territories/domain/territory-last-date-completed";

export const TerritoryLastDateCompletedMother = {
  create(value?: Temporal.PlainDate): TerritoryLastDateCompleted {
    const stringDate = faker.date.past().toISOString().split("T")[0];
    const randomDate = Temporal.PlainDate.from(stringDate);
    return new TerritoryLastDateCompleted(value ?? randomDate);
  },
};
