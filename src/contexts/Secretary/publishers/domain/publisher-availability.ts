import { Nullable } from "@/contexts/shared/domain/nullable";

import {
  DayOfWeek,
  PublisherAvailabilityDayOfWeek,
} from "./availability/publisher-availability-day-of-week";
import { PublisherAvailabilityFinishDate } from "./availability/publisher-availability-finish-date";
import {
  Frequency,
  PublisherAvailabilityFrequency,
} from "./availability/publisher-availability-frequency";
import { PublisherAvailabilityId } from "./availability/publisher-availability-id";
import { PublisherAvailabilityNotes } from "./availability/publisher-availability-notes";
import { PublisherAvailabilityStartDate } from "./availability/publisher-availability-start-date";
import {
  AvailabilityType,
  PublisherAvailabilityType,
} from "./availability/publisher-availability-type";
import { ThereIsNoAvailability } from "./availability/there-is-no-availability";

export type PublisherAvailabilityPrimitives = {
  daysOfWeek?: DayOfWeek[];
  finishDate?: string;
  frequency: Frequency;
  id: number;
  notes?: string;
  startDate?: string;
  type: AvailabilityType;
};

export class PublisherAvailability {
  readonly daysOfWeek: Nullable<PublisherAvailabilityDayOfWeek[]>;
  readonly finishDate: Nullable<PublisherAvailabilityFinishDate>;
  readonly frequency: PublisherAvailabilityFrequency;
  readonly id: PublisherAvailabilityId;
  readonly notes: Nullable<PublisherAvailabilityNotes>;
  readonly startDate: Nullable<PublisherAvailabilityStartDate>;
  readonly type: PublisherAvailabilityType;

  constructor(params: {
    daysOfWeek?: Nullable<PublisherAvailabilityDayOfWeek[]>;
    finishDate?: Nullable<PublisherAvailabilityFinishDate>;
    frequency: PublisherAvailabilityFrequency;
    id: PublisherAvailabilityId;
    notes?: Nullable<PublisherAvailabilityNotes>;
    startDate?: Nullable<PublisherAvailabilityStartDate>;
    type: PublisherAvailabilityType;
  }) {
    const { id, daysOfWeek, finishDate, frequency, notes, startDate, type } =
      params;

    this.#ensureThatIsSomeAvailability({
      daysOfWeek,
      finishDate,
      startDate,
    });

    this.id = id;
    this.daysOfWeek = daysOfWeek;
    this.finishDate = finishDate;
    this.frequency = frequency;
    this.notes = notes;
    this.startDate = startDate;
    this.type = type;
  }

  static fromPrimitives(
    params: PublisherAvailabilityPrimitives,
  ): PublisherAvailability {
    const { daysOfWeek, finishDate, notes, startDate } = params;
    return new PublisherAvailability({
      id: new PublisherAvailabilityId(params.id),
      daysOfWeek: daysOfWeek?.map(
        dayOfWeek => new PublisherAvailabilityDayOfWeek(dayOfWeek),
      ),
      finishDate: finishDate
        ? PublisherAvailabilityFinishDate.fromValue(finishDate)
        : undefined,
      frequency: new PublisherAvailabilityFrequency(params.frequency),
      notes: notes ? new PublisherAvailabilityNotes(notes) : undefined,
      startDate: startDate
        ? PublisherAvailabilityStartDate.fromValue(startDate)
        : undefined,
      type: new PublisherAvailabilityType(params.type),
    });
  }

  toPrimitives(): PublisherAvailabilityPrimitives {
    return {
      daysOfWeek: this.daysOfWeek?.map(dayOfWeek => dayOfWeek.value),
      finishDate: this.finishDate?.value,
      frequency: this.frequency.value,
      id: this.id.value,
      notes: this.notes?.value,
      startDate: this.startDate?.value,
      type: this.type.value,
    };
  }

  #ensureThatIsSomeAvailability(params: {
    daysOfWeek: Nullable<PublisherAvailabilityDayOfWeek[]>;
    finishDate: Nullable<PublisherAvailabilityFinishDate>;
    startDate: Nullable<PublisherAvailabilityStartDate>;
  }) {
    if (!params.daysOfWeek && !params.finishDate && !params.startDate) {
      throw new ThereIsNoAvailability("The availability is empty");
    }
  }
}
