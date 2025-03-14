import { PlainDateValueObject } from "@/contexts/shared/domain/value-object/plain-date-value-object";

export class PublisherBaptismDate extends PlainDateValueObject {
  static fromValue(value: string) {
    const plainDate = PlainDateValueObject.toTemporal(value);
    return new PublisherBaptismDate(plainDate);
  }
}
