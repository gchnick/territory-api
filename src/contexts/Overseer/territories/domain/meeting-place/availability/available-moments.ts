import { EnumValueObject } from "@/shared/domain/value-object/enum-value-object";
import { InvalidArgumentError } from "@/shared/domain/value-object/invalid-argument-error";

export enum Moments {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  EVENING = "EVENING",
  NIGHT = "NIGHT",
}

export class AvailableMoment extends EnumValueObject<Moments> {
  constructor(value: Moments) {
    super(value, Object.values(Moments));
  }

  static fromValue(value: string): AvailableMoment {
    for (const momentTypeValue of Object.values(Moments)) {
      if (value === momentTypeValue.toString()) {
        return new AvailableMoment(momentTypeValue);
      }
    }

    throw new InvalidArgumentError(
      `The Availability Moment type ${value} is invalid`,
    );
  }

  protected throwErrorForInvalidValue(value: Moments): void {
    throw new InvalidArgumentError(
      `The Availability Moment type <${value}> is invalid`,
    );
  }
}
