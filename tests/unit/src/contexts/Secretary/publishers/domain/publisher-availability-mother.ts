import { Temporal } from "temporal-polyfill";

import {
  PublisherAvailability,
  PublisherAvailabilityPrimitives,
} from "@/contexts/Secretary/publishers/domain";

import { PublisherAvailabilityDaysOfWeekMother } from "./availability/publisher-availability-days-of-week-mother";
import { PublisherAvailabilityFinishDateMother } from "./availability/publisher-availability-finish-date-mother";
import { PublisherAvailabilityFrequencyMother } from "./availability/publisher-availability-frequency-mother";
import { PublisherAvailabilityIdMother } from "./availability/publisher-availability-id-mother";
import { PublisherAvailabilityNotesMother } from "./availability/publisher-availability-notes";
import { PublisherAvailabilityStartDateMother } from "./availability/publisher-availability-start-date-mother";
import { PublisherAvailabilityTypeMother } from "./availability/publisher-availability-type-mother";

type PublisherAvailabilityPrimitivesWithoutDaysOfWeek = Omit<
  PublisherAvailabilityPrimitives,
  "daysOfWeek"
>;

type PublisherAvailabilityPrimitivesWithoutStartDateAndFinishDate = Omit<
  PublisherAvailabilityPrimitives,
  "startDate" | "finishDate"
>;

export const PublisherAvailabilityMother = {
  createWithDates(
    params?: Partial<PublisherAvailabilityPrimitivesWithoutDaysOfWeek>,
  ): PublisherAvailability {
    const startDate = PublisherAvailabilityStartDateMother.create().value;
    const finishDate = PublisherAvailabilityFinishDateMother.create(
      Temporal.ZonedDateTime.from(startDate).add({ days: 10 }),
    ).value;
    const primitives: PublisherAvailabilityPrimitivesWithoutDaysOfWeek = {
      frequency: PublisherAvailabilityFrequencyMother.create().value,
      id: PublisherAvailabilityIdMother.create().value,
      type: PublisherAvailabilityTypeMother.create().value,
      startDate,
      finishDate,
      notes: PublisherAvailabilityNotesMother.create().value,
      ...params,
    };
    return PublisherAvailability.fromPrimitives({ ...primitives });
  },
  createWithDaysOfWeek(
    params?: Partial<PublisherAvailabilityPrimitivesWithoutStartDateAndFinishDate>,
  ): PublisherAvailability {
    const primitives: PublisherAvailabilityPrimitivesWithoutStartDateAndFinishDate =
      {
        frequency: PublisherAvailabilityFrequencyMother.create().value,
        id: PublisherAvailabilityIdMother.create().value,
        type: PublisherAvailabilityTypeMother.create().value,
        daysOfWeek: PublisherAvailabilityDaysOfWeekMother.create().map(
          day => day.value,
        ),
        notes: PublisherAvailabilityNotesMother.create().value,
        ...params,
      };
    return PublisherAvailability.fromPrimitives({ ...primitives });
  },
  createMany(count = 3): PublisherAvailability[] {
    return Array.from({ length: count }, (_, index) =>
      Math.random() > 0.5
        ? this.createWithDaysOfWeek({ id: index })
        : this.createWithDates({ id: index }),
    );
  },
};
