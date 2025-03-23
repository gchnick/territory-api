import { Temporal } from "temporal-polyfill";

import { BaseDateValueObject } from "./base-date-value-object";

export class ZonedDateTimeValueObject extends BaseDateValueObject<Temporal.ZonedDateTime> {
  static toTemporal(value: string) {
    return Temporal.ZonedDateTime.from(value, { overflow: "reject" });
  }

  protected compare(other: Temporal.ZonedDateTime): number {
    return Temporal.ZonedDateTime.compare(this.date, other);
  }
}
