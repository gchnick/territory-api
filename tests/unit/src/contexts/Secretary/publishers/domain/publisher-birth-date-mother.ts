import { faker } from "@faker-js/faker";
import { Temporal } from "temporal-polyfill";

import { PublisherBirthDate } from "@/contexts/Secretary/publishers/domain";

export const PublisherBirthDateMother = {
  create(value?: Temporal.PlainDate) {
    const stringDate = faker.date.birthdate().toISOString().split("T")[0];
    return value
      ? new PublisherBirthDate(value)
      : PublisherBirthDate.fromValue(stringDate);
  },
};
