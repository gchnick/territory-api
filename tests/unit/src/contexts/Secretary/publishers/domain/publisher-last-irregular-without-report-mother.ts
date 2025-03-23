import { faker } from "@faker-js/faker";
import { Temporal } from "temporal-polyfill";

import { PublisherLastIrregularWithoutReport } from "@/contexts/Secretary/publishers/domain";

export const PublisherLastIrregularWithoutReportMother = {
  create(value?: Temporal.PlainDate) {
    const stringRandomDate = faker.date.past().toISOString().split("T")[0];
    const randomDate = Temporal.PlainDate.from(stringRandomDate);
    return new PublisherLastIrregularWithoutReport(value ?? randomDate);
  },
};
