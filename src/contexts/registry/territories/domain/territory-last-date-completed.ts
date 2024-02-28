import { InvalidArgumentError } from "@contexts/shared/domain/value-object/invalid-argument-error";
import { ValueObject } from "@contexts/shared/domain/value-object/value-object";

import { LastDateCompletedIsInvalid } from "./last-date-completed-is-invalid";

export class TerritoryLastDateCompleted extends ValueObject<Date> {
  constructor(value: Date) {
    super(value);
    this.#ensureDateIsNotString(value);
    this.#ensureDateIsPast(value);
  }

  #ensureDateIsNotString(value: Date | string) {
    if (typeof value === "string") {
      throw new InvalidArgumentError(
        `The last date completed <${value}> is a string`,
      );
    }
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