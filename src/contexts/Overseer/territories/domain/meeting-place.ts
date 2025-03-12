import { PublisherId } from "@/contexts/Secretary/publishers/domain/publisher-id";
import { Nullable } from "@/contexts/shared/domain/nullable";

import { MeetingPlaceId } from "./meeting-place/meeting-place-id";
import { MeetingPlaceLabel } from "./meeting-place/meeting-place-label";
import { MeetingPlaceLatitude } from "./meeting-place/meeting-place-latitude";
import { MeetingPlaceLongitude } from "./meeting-place/meeting-place-longitude";

export type MeetingPlacePrimitives = {
  address: string;
  id: string;
  latitude?: string;
  longitude?: string;
  publisherLiving?: string;
};

export class MeetingPlace {
  readonly address: MeetingPlaceLabel;
  readonly id: MeetingPlaceId;
  readonly latitude: Nullable<MeetingPlaceLatitude>;
  readonly longitude: Nullable<MeetingPlaceLongitude>;
  readonly publisherLiving: Nullable<PublisherId>;

  constructor(
    address: MeetingPlaceLabel,
    id: MeetingPlaceId,
    latitude: Nullable<MeetingPlaceLatitude>,
    longitude: Nullable<MeetingPlaceLongitude>,
    publisherLiving: Nullable<PublisherId>,
  ) {
    this.id = id;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.publisherLiving = publisherLiving;
  }

  static fromPrimitives(plainData: {
    address: string;
    id: string;
    latitude?: string;
    longitude?: string;
    publisherLiving?: string;
  }): MeetingPlace {
    const latitude = plainData.latitude;
    const longitude = plainData.longitude;
    const publisherLiving = plainData.publisherLiving;
    return new MeetingPlace(
      new MeetingPlaceLabel(plainData.address),
      new MeetingPlaceId(plainData.id),
      latitude ? new MeetingPlaceLatitude(latitude) : undefined,
      longitude ? new MeetingPlaceLongitude(longitude) : undefined,
      publisherLiving ? new PublisherId(publisherLiving) : undefined,
    );
  }

  toPrimitives(): MeetingPlacePrimitives {
    return {
      id: this.id.value,
      address: this.address.value,
      latitude: this.latitude?.value,
      longitude: this.longitude?.value,
      publisherLiving: this.publisherLiving?.value,
    };
  }
}
