import { Primitives, ValueObject } from "./value-object";

export class BooleanValueObject extends ValueObject<boolean> {
  static parse(value: string) {
    return value === "true" ? true : false;
  }

  static isBoolean(value?: Primitives) {
    if (!value) return false;
    if (typeof value === "boolean") return true;
    if (typeof value !== "string") return false;
    return value === "true" || value === "false";
  }

  static isBooleanParse(value: string) {
    if (!BooleanValueObject.isBoolean(value)) {
      return value;
    }

    return BooleanValueObject.parse(value);
  }
}
