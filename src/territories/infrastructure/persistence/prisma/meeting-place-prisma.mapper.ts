import {
  MeetingPlace,
  PartialIMeetingPlace,
} from '@territories/domain/meeting-place/meeting-place';

type MeetingPlaceEntity = {
  id?: string;
  place: string;
  phone: string | null;
  field_service: boolean;
  latitude: string | null;
  longitude: string | null;
};

type AvailabilityEntity = {
  day: string;
  frequency: string;
  moment: string;
};

type MeetingPlaceEntityWithAvailability = {
  availability: AvailabilityEntity[];
} & MeetingPlaceEntity;

export type Entity = MeetingPlaceEntity | MeetingPlaceEntityWithAvailability;

export class MeetingPlacePrismaMapper {
  static fromEntity(meetingPlace: Entity): MeetingPlace {
    return this.checkIsMeetingPlaceEntityWithAvailability(meetingPlace)
      ? MeetingPlace.fromPrimitive({
          id: meetingPlace.id,
          place: meetingPlace.place,
          phone: meetingPlace.phone,
          fieldService: meetingPlace.field_service,
          latitude: meetingPlace.latitude,
          longitude: meetingPlace.longitude,
          availability: this.fromAvailabilityEntity(meetingPlace.availability),
        })
      : MeetingPlace.fromPrimitive({
          id: meetingPlace.id,
          place: meetingPlace.place,
          phone: meetingPlace.phone,
          fieldService: meetingPlace.field_service,
          latitude: meetingPlace.latitude,
          longitude: meetingPlace.longitude,
          availability: undefined,
        });
  }

  static fromPartialIMeetingPlace(
    meetingPlace: PartialIMeetingPlace,
  ): Partial<MeetingPlaceEntity> {
    return {
      id: meetingPlace.id,
      place: meetingPlace.place,
      phone: meetingPlace.phone,
      latitude: meetingPlace.latitude,
      longitude: meetingPlace.longitude,
      field_service: meetingPlace.fieldService,
    };
  }

  /**
   * Check guard
   */
  static checkIsMeetingPlaceEntityWithAvailability(
    entity: MeetingPlaceEntity,
  ): entity is MeetingPlaceEntityWithAvailability {
    return (
      typeof (entity as MeetingPlaceEntityWithAvailability).availability !==
      'undefined'
    );
  }

  static fromAvailabilityEntity = (
    entity: AvailabilityEntity[] | undefined,
  ) => {
    if (!entity) return undefined;
    const array: {
      day: string;
      available: {
        frequency: string;
        moment: string;
      };
    }[] = [];

    entity.forEach((a) => {
      array.push({
        day: a.day,
        available: {
          frequency: a.frequency,
          moment: a.moment,
        },
      });
    });

    return array;
  };
}
