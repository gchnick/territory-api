import { Temporal } from "temporal-polyfill";

import { StringValueObject } from "./string-value-object";

export class ZonedDateTimeValueObject extends StringValueObject {
  readonly date: Temporal.ZonedDateTime;

  constructor(value: Temporal.ZonedDateTime) {
    super(value.toString());
    this.date = value;
  }

  static toTemporal(value: string) {
    return Temporal.ZonedDateTime.from(value, { overflow: "reject" });
  }
}
