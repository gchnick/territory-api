import { faker } from "@faker-js/faker";
import { Temporal } from "temporal-polyfill";

import { PublisherBaptismDate } from "@/contexts/Secretary/publishers/domain";

export const PublisherBaptismDateMother = {
  create(value?: Temporal.PlainDate) {
    const stringDate = faker.date.past().toISOString().split("T")[0];
    return value
      ? new PublisherBaptismDate(value)
      : PublisherBaptismDate.fromValue(stringDate);
  },
};
