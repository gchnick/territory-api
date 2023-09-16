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
    } catch (e) {
      console.log(`Meeting place with id '${meetingPlaceId} not found.'`);
      console.log(e);
    }
  };
}

export const availabilityModel = new AvailabilityModel();

// TO UPDATE AVAILABILITY
// if (meetingPlace.availability) {
//   const currentAvailability = toAvailabilityModel(
//     meetingPlace.availability
//   );
//   updatedAvailability = setAvailability(
//     currentAvailability,
//     data
//   );

//   await prisma.meeting_place_availability.deleteMany({
//     where: { meeting_place_id: meetingPlaceId }
//   });
// }
