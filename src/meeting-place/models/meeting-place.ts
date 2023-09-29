import { prisma } from '../../config/connection';
import { toAvailabilityModel } from '../../shared/models/availability';
import { InvalidParams } from '../../shared/models/error-model';
import { TerritoryNotFount } from '../../territories/models/errors';
import { territoryModel } from '../../territories/models/territory';
import { Territory } from '../../territories/models/types';
import {
  Entity,
  MeetingPlace,
  MeetingPlaceEntity,
  MeetingPlaceEntityWithAvailability,
  PartialMeetingPlace
} from '../types';
import { MeetingPlaceNotFount } from './errors';

class MeetingPlaceModel {
  getById = async (id: string) => {
    const meetingPlace = await prisma.meeting_places.findFirst({
      where: { id },
      include: { availability: true }
    });

    if (!meetingPlace)
      throw new MeetingPlaceNotFount(`Meeting place with id '${id}' not found`);

    return this.toModel(meetingPlace);
  };

  getTerritory = async (meetingPlace: MeetingPlace) => {
    const search = await prisma.meeting_places.findUnique({
      where: { id: meetingPlace.id },
      select: { territory: true }
    });

    if (!search) {
      throw new TerritoryNotFount(
        `Territory with meeting place: "${meetingPlace.place} not found"`
      );
    }

    return territoryModel.toModel(search.territory);
  };

  /**
   * To set meeting place of teritory first be delete all places registry and later
   * be create new registry with data resive
   */
  set = async (territory: Territory, data: MeetingPlace[]) => {
    const territoryId = territory.id;
    if (!territoryId)
      throw new InvalidParams('Invalid params to create registry');

    const meetingPlaces: MeetingPlace[] = [];

    // Delete all meeting places of territory in database
    if (territory.meetingPlaces && territory.meetingPlaces.length > 0) {
      await prisma.meeting_places.deleteMany({
        where: { territory_id: territoryId }
      });
    }

    // Create new meeting places of territory in databse
    for (let value of data) {
      const meeting = await prisma.meeting_places.create({
        include: { availability: true },
        data: {
          territory_id: territoryId,
          place: value.place,
          latitude: value.latitude,
          longitude: value.longitude
        }
      });

      meetingPlaces.push(this.toModel(meeting));
    }

    const updatedTerritory = structuredClone(territory);
    updatedTerritory.meetingPlaces = meetingPlaces;

    return updatedTerritory;
  };

  update = async (meetingPlace: MeetingPlace, data: MeetingPlace) => {
    const updatedMeetingPlace = await prisma.meeting_places.update({
      where: { id: meetingPlace.id },
      data: {
        place: data.place,
        latitude: data.latitude,
        longitude: data.longitude
      }
    });

    return this.toModel(updatedMeetingPlace);
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
          availability: toAvailabilityModel(entity.availability)
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

  #toEntity(model: PartialMeetingPlace): Partial<MeetingPlaceEntity> {
    return {
      id: model.id,
      place: model.place,
      phone: model.phone,
      latitude: model.latitude,
      longitude: model.longitude,
      field_service: model.fieldService
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
