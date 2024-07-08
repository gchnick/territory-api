import { Nullable } from "@/contexts/shared/domain/nullable";

import {
  AvailabilityPrimitives,
  MeetingPlaceAvailability,
} from "./meeting-place-availability";
import { MeetingPlaceFieldService } from "./meeting-place-field-service";
import { MeetingPlaceId } from "./meeting-place-id";
import { MeetingPlaceLabel } from "./meeting-place-label";
import { MeetingPlaceLatitude } from "./meeting-place-latitude";
import { MeetingPlaceLongitude } from "./meeting-place-longitude";
import { MeetingPlacePhone } from "./meeting-place-phone";

export type MeetingPlacePrimitives = {
  id: string;
  place: string;
  phone?: string;
  latitude: string;
  longitude: string;
  fieldService: boolean;
  availability?: AvailabilityPrimitives;
};

export class MeetingPlace {
  readonly id: MeetingPlaceId;
  readonly place: MeetingPlaceLabel;
  readonly phone: Nullable<MeetingPlacePhone>;
  readonly latitude: MeetingPlaceLatitude;
  readonly longitude: MeetingPlaceLongitude;
  readonly fieldService: MeetingPlaceFieldService;
  readonly availability: Nullable<MeetingPlaceAvailability>;

  constructor(
    id: MeetingPlaceId,
    place: MeetingPlaceLabel,
    phone: Nullable<MeetingPlacePhone>,
    latitude: MeetingPlaceLatitude,
    longitude: MeetingPlaceLongitude,
    fieldService: MeetingPlaceFieldService,
    availability: Nullable<MeetingPlaceAvailability>,
  ) {
    this.id = id;
    this.place = place;
    this.phone = phone;
    this.latitude = latitude;
    this.longitude = longitude;
    this.fieldService = fieldService;
    this.availability = availability;
  }

  static fromPrimitive(plainData: {
    id: string;
    place: string;
    phone?: string;
    latitude: string;
    longitude: string;
    fieldService: boolean;
    availability?: AvailabilityPrimitives;
  }): MeetingPlace {
    return new MeetingPlace(
      new MeetingPlaceId(plainData.id),
      new MeetingPlaceLabel(plainData.place),
      plainData.phone ? new MeetingPlacePhone(plainData.phone) : undefined,
      new MeetingPlaceLatitude(plainData.latitude),
      new MeetingPlaceLongitude(plainData.longitude),
      new MeetingPlaceFieldService(plainData.fieldService),
      plainData.availability
        ? MeetingPlaceAvailability.fromPrimitives({
            availability: plainData.availability,
          })
        : undefined,
    );
  }

  toPrimitives(): MeetingPlacePrimitives {
    return {
      id: this.id.value,
      place: this.place.value,
      phone: this.phone?.value,
      latitude: this.latitude.value,
      longitude: this.longitude.value,
      fieldService: this.fieldService.value,
      availability: this.availability?.toPrimitives(),
    };
  }
}
