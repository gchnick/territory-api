import { faker } from "@faker-js/faker";
import { Temporal } from "temporal-polyfill";

import { PublisherAvailabilityStartDate } from "@/contexts/Secretary/publishers/domain";

export const PublisherAvailabilityStartDateMother = {
  create(value?: Temporal.ZonedDateTime): PublisherAvailabilityStartDate {
    const isoStringRandomDate = faker.date.future().toISOString();
    const instant = Temporal.Instant.from(isoStringRandomDate);
    const randomDate = instant.toZonedDateTimeISO("America/Venezuela");
    return new PublisherAvailabilityStartDate(value ?? randomDate);
  },
};
