import { ValueObject } from "@/shared/domain/value-object/value-object";

import { LastDateCompletedIsInvalid } from "./last-date-completed-is-invalid";

export class TerritoryLastDateCompleted extends ValueObject<Date> {
  constructor(value: Date) {
    let date = value;
    if (typeof value === "string") {
      date = new Date(value);
    }
    super(date);
    this.#ensureDateIsPast(date);
  }

  #ensureDateIsPast(value: Date) {
    const now = new Date();
    if (value >= now) {
      throw new LastDateCompletedIsInvalid(
        `The Last Date Completed <${value.toString()}> is not past`,
      );
    }
  }
}
