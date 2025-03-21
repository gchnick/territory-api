import { EnumValueObject } from "./value-object/enum-value-object";
import { InvalidArgumentError } from "./value-object/invalid-argument-error";

export enum Sex {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export class SexValueObject extends EnumValueObject<Sex> {
  constructor(value: Sex) {
    super(value, Object.values(Sex));
  }

  static fromValue(value: string): SexValueObject {
    for (const sexTypeValue of Object.values(Sex)) {
      if (value === sexTypeValue.toString()) {
        return new SexValueObject(sexTypeValue);
      }
    }

    throw new InvalidArgumentError(`The Sex type ${value} is invalid`);
  }

  protected throwErrorForInvalidValue(value: Sex): void {
    throw new InvalidArgumentError(`The Sex type <${value}> is invalid`);
  }
}
