import { PlainDateValueObject } from "@/contexts/shared/domain/value-object/plain-date-value-object";

export class PublisherLastReport extends PlainDateValueObject {
  static fromValue(value: string) {
    const plainDate = PlainDateValueObject.toTemporal(value);
    return new PublisherLastReport(plainDate);
  }
}
