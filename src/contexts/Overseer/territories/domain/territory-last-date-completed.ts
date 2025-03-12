import { Temporal } from "temporal-polyfill";

import { PlainDateValueObject } from "@/contexts/shared/domain/value-object/pain-date-value-object";

import { LastDateCompletedIsInvalid } from "./last-date-completed-is-invalid";

export class TerritoryLastDateCompleted extends PlainDateValueObject {
  constructor(value: Temporal.PlainDate) {
    super(value);
    this.#ensureDateIsPast(value);
  }

  #ensureDateIsPast(value: Temporal.PlainDate) {
    const now = Temporal.Now.plainDateISO();
    const dateIsFuture = Temporal.PlainDate.compare(value, now) === 1;
    if (dateIsFuture) {
      throw new LastDateCompletedIsInvalid(
        `The Last Date Completed <${value.toString()}> is not past`,
      );
    }
  }

  static fromPrimitive(value: string) {
    return new TerritoryLastDateCompleted(
      PlainDateValueObject.toTemporal(value),
    );
  }
}
