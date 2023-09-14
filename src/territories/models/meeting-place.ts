import { prisma } from '../../config/connection';
import {
  getAvailableCreateQuery,
  setAvailability,
  toAvailabilityModel
} from '../../shared/models/availability';
import { Availability } from '../../shared/models/types';
import { MeetingPlaceNotFount } from './errors';
import {
  Entity,
  MeetingPlaceEntity,
  MeetingPlaceEntityWithAvailability
} from './meeting-place/types';
import { MeetingPlace, Territory } from './types';

class MeetingPlaceModel {
  /**
   * To set meeting place of teritory first be delete all places registry and later
   * be create new registry with data resive
   */
  set = async (territory: Territory, data: MeetingPlace[]) => {
    const meetingPlaces: MeetingPlaceEntity[] = [];
    const territoryId = territory.id;

    // Delete all registries in database
    territoryId &&
      (await prisma.meeting_places.deleteMany({
        where: { territory_id: territoryId }
      }));

    // Create new registries in databse
    territoryId &&
      data.forEach(async (m) => {
        const meeting = await prisma.meeting_places.create({
          data: {
            territory_id: territoryId,
            place: m.place,
            phone: m.phone,
            field_service: m.fieldService,
            latitude: m.latitude,
            longitude: m.longitude,
            availability: {
              create: getAvailableCreateQuery(m.availavility)
            }
          }
        });
        meetingPlaces.push(meeting);
      });

    const meeting = {
      meetingPlaces: meetingPlaces.map((m) => this.toModel(m))
    };

    return {
      ...territory,
      ...meeting.meetingPlaces
    };
  };

  update = async (id: string, data: MeetingPlace) => {
    let updatedAvailability: Availability | undefined = undefined;

    const meetingPlace = await prisma.meeting_places.findFirst({
      where: { id },
      select: { id: true, availability: true }
    });

    if (!meetingPlace)
      throw new MeetingPlaceNotFount(`Meeting place with id '${id}' not found`);

    if (data.availavility) {
      const currentAvailability = toAvailabilityModel(
        meetingPlace.availability
      );
      updatedAvailability = setAvailability(
        currentAvailability,
        data.availavility
      );

      await prisma.meeting_place_availability.deleteMany({
        where: { meeting_place_id: id }
      });
    }

    const updatedMeetingPlace = await prisma.meeting_places.update({
      where: { id },
      data: {
        place: data.place,
        phone: data.phone,
        field_service: data.fieldService,
        latitude: data.latitude,
        longitude: data.longitude,
        availability: {
          create: getAvailableCreateQuery(updatedAvailability)
        }
      }
    });

    return updatedMeetingPlace;
  };

  delete = async (id: string) => {
    const exist = await prisma.meeting_places.findFirst({
      where: { id },
      select: { id: true }
    });

    exist &&
      (await prisma.meeting_places.delete({
        where: { id }
      }));
  };

  toModel(entity: Entity): MeetingPlace {
    return this.#checkIsMeetingPlaceEntityWithAvailability(entity)
      ? {
          id: entity.id,
          place: entity.place,
          phone: entity.phone ?? undefined,
          fieldService: entity.field_service,
          latitude: entity.latitude ?? undefined,
          longitude: entity.longitude ?? undefined,
          availavility: toAvailabilityModel(entity.availability)
        }
      : {
          id: entity.id,
          place: entity.place,
          phone: entity.phone ?? undefined,
          fieldService: entity.field_service,
          latitude: entity.latitude ?? undefined,
          longitude: entity.longitude ?? undefined
        };
  }

  /**
   * Check guard
   */
  #checkIsMeetingPlaceEntityWithAvailability(
    entity: MeetingPlaceEntity
  ): entity is MeetingPlaceEntityWithAvailability {
    return (
      typeof (entity as MeetingPlaceEntityWithAvailability).availability !==
      'undefined'
    );
  }
}

export const meetingPlaceModel = new MeetingPlaceModel();
