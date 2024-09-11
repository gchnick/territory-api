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

export class Day extends EnumValueObject<Days> {
  constructor(value: Days) {
    super(value, Object.values(Days));
  }

  static fromValue(value: string): Day {
    for (const dayTypeValue of Object.values(Days)) {
      if (value === dayTypeValue.toString()) {
        return new Day(dayTypeValue);
      }
    }

    throw new InvalidArgumentError(`The day type ${value} is invalid`);
  }

  protected throwErrorForInvalidValue(value: Days): void {
    throw new InvalidArgumentError(`The day type <${value}> is invalid`);
  }
}
