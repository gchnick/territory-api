import { Nullable } from '@shared/domain/nullable';
import {
  IAvailability,
  MeetingPlaceAvailability,
} from './meeting-place-availability';
import { MeetingPlaceFieldService } from './meeting-place-field-service';
import { MeetingPlaceId } from './meeting-place-id';
import { MeetingPlaceLabel } from './meeting-place-label';
import { MeetingPlaceLatitude } from './meeting-place-latitude';
import { MeetingPlaceLongitude } from './meeting-place-longitude';
import { MeetingPlacePhone } from './meeting-place-phone';

export type IMeetingPlace = {
  id?: string;
  place: string;
  phone?: string;
  latitude?: string;
  longitude?: string;
  fieldService: boolean;
  availability?: IAvailability;
};

export type PartialIMeetingPlace = Partial<IMeetingPlace>;

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
    availability?: {
      day: string;
      available: {
        frequency: string;
        moment: string;
      };
    }[];
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

  toPrimitives() {
    return {
      id: this.id.value,
      place: this.place.value,
      phone: this.phone ? this.phone.value : undefined,
      latitude: this.latitude.value,
      longitude: this.longitude.value,
      fieldService: this.fieldService.value,
      availability: this.availability
        ? this.availability.toPrimitives()
        : undefined,
    };
  }
}
