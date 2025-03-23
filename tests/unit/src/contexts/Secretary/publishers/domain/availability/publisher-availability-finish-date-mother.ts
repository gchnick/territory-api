import { faker } from "@faker-js/faker";
import { Temporal } from "temporal-polyfill";

import { PublisherAvailabilityFinishDate } from "@/contexts/Secretary/publishers/domain";

export const PublisherAvailabilityFinishDateMother = {
  create(value?: Temporal.ZonedDateTime): PublisherAvailabilityFinishDate {
    const isoStringRandomDate = faker.date.future().toISOString();
    const instant = Temporal.Instant.from(isoStringRandomDate);
    const randomDate = instant.toZonedDateTimeISO("America/Venezuela");
    return new PublisherAvailabilityFinishDate(value ?? randomDate);
  },
};
