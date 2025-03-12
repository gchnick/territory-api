import { Temporal } from "temporal-polyfill";

import { StringValueObject } from "./string-value-object";

export class PlainDateValueObject extends StringValueObject {
  readonly date: Temporal.PlainDate;

  constructor(value: Temporal.PlainDate) {
    super(value.toString());
    this.date = value;
  }

  static toTemporal(value: string) {
    return Temporal.PlainDate.from(value, { overflow: "reject" });
  }
}
