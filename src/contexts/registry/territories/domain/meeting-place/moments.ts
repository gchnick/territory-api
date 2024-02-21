import { EnumValueObject } from "@contexts/shared/domain/value-object/enum-value-object";
import { InvalidArgumentError } from "@contexts/shared/domain/value-object/invalid-argument-error";

export enum Moments {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  EVENING = "EVENING",
  NIGHT = "NIGHT",
}

export class Moment extends EnumValueObject<Moments> {
  constructor(value: Moments) {
    super(value, Object.values(Moments));
  }

  static fromValue(value: string): Moment {
    for (const momentTypeValue of Object.values(Moments)) {
      if (value === momentTypeValue.toString()) {
        return new Moment(momentTypeValue);
      }
    }

    throw new InvalidArgumentError(`The moment type ${value} is invalid`);
  }

  protected throwErrorForInvalidValue(value: Moments): void {
    throw new InvalidArgumentError(`The moment type <${value}> is invalid`);
  }
}
