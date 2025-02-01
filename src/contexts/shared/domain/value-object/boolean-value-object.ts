import { InvalidArgumentError } from "./invalid-argument-error";
import { Primitives, ValueObject } from "./value-object";

export class BooleanValueObject extends ValueObject<boolean> {
  constructor(value: string) {
    const booleanValue = BooleanValueObject.toBoolean(value);
    super(booleanValue);
    this.#ensureIsBoolean(value);
  }

  static toBoolean(value: string) {
    return value === "true" ? true : false;
  }

  static isBoolean(value?: Primitives) {
    if (!value) return false;
    if (typeof value === "boolean") return true;
    if (typeof value !== "string") return false;
    return value === "true" || value === "false";
  }

  #ensureIsBoolean(value: string) {
    if (!BooleanValueObject.isBoolean(value)) {
      throw new InvalidArgumentError(`${value} is not a boolean`);
    }
  }
}
