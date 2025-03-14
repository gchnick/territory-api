import type { Primitives } from "./value-object";

import { InvalidArgumentError } from "./invalid-argument-error";
import { ValueObject } from "./value-object";

export class BooleanValueObject extends ValueObject<boolean> {
  static #toBoolean(value: string) {
    return value === "true" ? true : false;
  }

  static fromValue(value: string) {
    if (!BooleanValueObject.isBoolean(value)) {
      throw new InvalidArgumentError(`${value} is not a boolean`);
    }

    const bool = BooleanValueObject.#toBoolean(value);
    return new BooleanValueObject(bool);
  }

  static isBoolean(value?: Primitives) {
    if (!value) return false;
    if (typeof value === "boolean") return true;
    if (typeof value !== "string") return false;
    return value === "true" || value === "false";
  }
}
