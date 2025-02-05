import { EnumValueObject } from "@/shared/domain/value-object/enum-value-object";
import { InvalidArgumentError } from "@/shared/domain/value-object/invalid-argument-error";

export enum Days {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export class AvailableDay extends EnumValueObject<Days> {
  constructor(value: Days) {
    super(value, Object.values(Days));
  }

  static fromValue(value: string): AvailableDay {
    for (const dayTypeValue of Object.values(Days)) {
      if (value === dayTypeValue.toString()) {
        return new AvailableDay(dayTypeValue);
      }
    }

    throw new InvalidArgumentError(
      `The Available Day type ${value} is invalid`,
    );
  }

  protected throwErrorForInvalidValue(value: Days): void {
    throw new InvalidArgumentError(
      `The Available Day type <${value}> is invalid`,
    );
  }
}
