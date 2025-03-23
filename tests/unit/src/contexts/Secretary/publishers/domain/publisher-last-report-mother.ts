import { faker } from "@faker-js/faker";
import { Temporal } from "temporal-polyfill";

import { PublisherLastReport } from "@/contexts/Secretary/publishers/domain";

export const PublisherLastReportMother = {
  create(value?: Temporal.PlainDate) {
    const stringRandomDate = faker.date.recent().toISOString().split("T")[0];
    const randomDate = Temporal.PlainDate.from(stringRandomDate);
    return new PublisherLastReport(value ?? randomDate);
  },
};
