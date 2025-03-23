import { Temporal } from "temporal-polyfill";

import { BaseDateValueObject } from "./base-date-value-object";

export class PlainDateTimeValueObject extends BaseDateValueObject<Temporal.PlainDateTime> {
  static toTemporal(value: string) {
    return Temporal.PlainDateTime.from(value, { overflow: "reject" });
  }

  protected compare(other: Temporal.PlainDateTime): number {
    return Temporal.PlainDateTime.compare(this.date, other);
  }
}
