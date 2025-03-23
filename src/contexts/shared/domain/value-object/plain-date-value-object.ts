import { Temporal } from "temporal-polyfill";

import { BaseDateValueObject } from "./base-date-value-object";

export abstract class PlainDateValueObject extends BaseDateValueObject<Temporal.PlainDate> {
  static toTemporal(value: string) {
    return Temporal.PlainDate.from(value, { overflow: "reject" });
  }

  protected compare(other: Temporal.PlainDate): number {
    return Temporal.PlainDate.compare(this.date, other);
  }
}
