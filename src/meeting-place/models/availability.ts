import { prisma } from '../../config/connection';
import { toAvailabilityEntity } from '../../shared/models/availability';
import { InvalidParams } from '../../shared/models/error-model';
import { MeetingPlace } from '../types';
import { meetingPlaceModel } from './meeting-place';
import { SetMeetingPlaceAvailability } from './types';

class AvailabilityModel {
  set = async (
    meetingPlace: MeetingPlace,
    data: SetMeetingPlaceAvailability
  ) => {
    if (!meetingPlace.id) {
      throw new InvalidParams(
        `Invalid params to set availability of meeting place`
      );
    }

    // Delete all availability info
    if (meetingPlace.availability) {
      await prisma.meeting_place_availability.deleteMany({
        where: { meeting_place_id: meetingPlace.id }
      });
    }

    const updatedMeetingPlace = await prisma.meeting_places.update({
      where: { id: meetingPlace.id },
      include: { availability: true },
      data: {
        phone: data.phone,
        field_service: data.fieldService,
        availability: {
          create: toAvailabilityEntity(data.availability)
        }
      }
    });

    return meetingPlaceModel.toModel(updatedMeetingPlace);
  };

  delete = async (meetingPlaceId: string) => {
    try {
      await prisma.meeting_place_availability.deleteMany({
        where: { meeting_place_id: meetingPlaceId }
      });

      await prisma.meeting_places.update({
        where: { id: meetingPlaceId },
        data: { phone: null, field_service: false }
      });
    } catch (e) {
      console.log(`Meeting place with id '${meetingPlaceId} not found.'`);
      console.log(e);
    }
  };
}

export const availabilityModel = new AvailabilityModel();
