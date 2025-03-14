import { PlainDateValueObject } from "@/contexts/shared/domain/value-object/plain-date-value-object";

export class PublisherPrivilegeInitDate extends PlainDateValueObject {
  static fromValue(value: string) {
    const plainDate = PlainDateValueObject.toTemporal(value);
    return new PublisherPrivilegeInitDate(plainDate);
  }
}
