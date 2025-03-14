import { ZonedDateTimeValueObject } from "@/contexts/shared/domain/value-object/zoned-date-time-value-object";

export class PublisherAvailabilityFinishDate extends ZonedDateTimeValueObject {
  static fromValue(value: string) {
    const zonedDateTime = ZonedDateTimeValueObject.toTemporal(value);
    return new PublisherAvailabilityFinishDate(zonedDateTime);
  }
}
