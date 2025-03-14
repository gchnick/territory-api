import { Temporal } from "temporal-polyfill";

import { StringValueObject } from "./string-value-object";

export class PlainDateTimeValueObject extends StringValueObject {
  readonly date: Temporal.PlainDateTime;

  constructor(value: Temporal.PlainDateTime) {
    super(value.toString());
    this.date = value;
  }

  static toTemporal(value: string) {
    return Temporal.PlainDateTime.from(value, { overflow: "reject" });
  }
}
