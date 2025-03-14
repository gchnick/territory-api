import { EnumValueObject } from "@/contexts/shared/domain/value-object/enum-value-object";
import { InvalidArgumentError } from "@/contexts/shared/domain/value-object/invalid-argument-error";

export enum AvailabilityType {
  ABSENCE = "ABSENCE",
  AVAILABLE = "AVAILABLE",
}

export class PublisherAvailabilityType extends EnumValueObject<AvailabilityType> {
  constructor(value: AvailabilityType) {
    super(value, Object.values(AvailabilityType));
  }

  static fromValue(value: string): PublisherAvailabilityType {
    for (const availabilityTypeValue of Object.values(AvailabilityType)) {
      if (value === availabilityTypeValue.toString()) {
        return new PublisherAvailabilityType(availabilityTypeValue);
      }
    }

    throw new InvalidArgumentError(`The Availability type ${value} is invalid`);
  }

  protected throwErrorForInvalidValue(value: AvailabilityType): void {
    throw new InvalidArgumentError(
      `The Availability type <${value}> is invalid`,
    );
  }
}
