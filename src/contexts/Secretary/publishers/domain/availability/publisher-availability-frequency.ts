import { EnumValueObject } from "@/contexts/shared/domain/value-object/enum-value-object";
import { InvalidArgumentError } from "@/contexts/shared/domain/value-object/invalid-argument-error";

export enum Frequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  ANNUALLY = "ANNUALLY",
  ONE_TIME = "ONE_TIME",
}

export class PublisherAvailabilityFrequency extends EnumValueObject<Frequency> {
  constructor(value: Frequency) {
    super(value, Object.values(Frequency));
  }

  static fromValue(value: string): PublisherAvailabilityFrequency {
    for (const frequencyTypeValue of Object.values(Frequency)) {
      if (value === frequencyTypeValue.toString()) {
        return new PublisherAvailabilityFrequency(frequencyTypeValue);
      }
    }

    throw new InvalidArgumentError(`The Frequency type ${value} is invalid`);
  }

  protected throwErrorForInvalidValue(value: Frequency): void {
    throw new InvalidArgumentError(`The Frequency type <${value}> is invalid`);
  }
}
