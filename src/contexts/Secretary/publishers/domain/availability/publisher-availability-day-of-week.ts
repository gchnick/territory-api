import { EnumValueObject } from "@/contexts/shared/domain/value-object/enum-value-object";
import { InvalidArgumentError } from "@/contexts/shared/domain/value-object/invalid-argument-error";

export enum DayOfWeek {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}

export class PublisherAvailabilityDayOfWeek extends EnumValueObject<DayOfWeek> {
  constructor(value: DayOfWeek) {
    super(value, Object.values(DayOfWeek));
  }

  static fromValue(value: string): PublisherAvailabilityDayOfWeek {
    for (const dayOfWeekTypeValue of Object.values(DayOfWeek)) {
      if (value === dayOfWeekTypeValue.toString()) {
        return new PublisherAvailabilityDayOfWeek(dayOfWeekTypeValue);
      }
    }

    throw new InvalidArgumentError(`The Day Of Week type ${value} is invalid`);
  }

  protected throwErrorForInvalidValue(value: DayOfWeek): void {
    throw new InvalidArgumentError(
      `The Day Of Week type <${value}> is invalid`,
    );
  }
}
