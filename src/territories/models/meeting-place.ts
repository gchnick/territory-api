import { prisma } from '../../config/connection';
import { MeetingPlaceNotFount } from './errors';
import { MeetingPlace, MeetingPlaceEntity, Territory } from './types';

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
      (await prisma.meetingPlaces.deleteMany({
        where: { territory_id: territoryId }
      }));

    // Create new registries in databse
    territoryId &&
      data.forEach(async (m) => {
        const meeting = await prisma.meetingPlaces.create({
          data: {
            territory_id: territoryId,
            place: m.place,
            latitude: m.latitude,
            longitude: m.longitude
          }
        });
        meetingPlaces.push(meeting);
      });

    const meeting = {
      meetingPlaces: meetingPlaces.map((m) => this.#toModel(m))
    };

    return {
      ...territory,
      ...meeting.meetingPlaces
    };
  };

  update = async (id: string, data: MeetingPlace) => {
    const exist = await prisma.meetingPlaces.findFirst({
      where: { id },
      select: { id: true }
    });

    if (!exist)
      throw new MeetingPlaceNotFount(`Meeting place with id '${id}' not found`);

    const updatedMeetingPlace = await prisma.meetingPlaces.update({
      where: { id },
      data
    });
    return updatedMeetingPlace;
  };

  delete = async (id: string) => {
    const exist = await prisma.meetingPlaces.findFirst({
      where: { id },
      select: { id: true }
    });

    exist &&
      (await prisma.meetingPlaces.delete({
        where: { id }
      }));
  };

  #toModel(entity: MeetingPlaceEntity): MeetingPlace {
    return {
      id: entity.id,
      place: entity.place,
      latitude: entity.latitude ?? undefined,
      longitude: entity.longitude ?? undefined
    };
  }
}

export const meetingPlaceModel = new MeetingPlaceModel();
