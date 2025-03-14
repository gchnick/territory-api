import { PlainDateValueObject } from "@/contexts/shared/domain/value-object/plain-date-value-object";

export class PublisherBirthDate extends PlainDateValueObject {
  static fromValue(value: string) {
    const plainDate = PlainDateValueObject.toTemporal(value);
    return new PublisherBirthDate(plainDate);
  }
}
