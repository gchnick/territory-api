import { prisma } from '../../config/connection';
import {
  toAvailabilityEntity,
  toAvailabilityModel
} from '../../shared/models/availability';
import { Availability } from '../../shared/models/types';
import { Conductor } from './types';

class AvailabilityModel {
  set = async (conductor: Conductor, data: Availability) => {
    // Delete all availability info
    if (conductor.availability) {
      await prisma.meeting_place_availability.deleteMany({
        where: { meeting_place_id: conductor.id }
      });
    }

    const updated = await prisma.conductors.update({
      where: { id: conductor.id },
      select: { availability: true },
      data: {
        availability: {
          create: toAvailabilityEntity(data)
        }
      }
    });

    const updatedConductor = structuredClone(conductor);
    updatedConductor.availability = toAvailabilityModel(updated.availability);

    return updatedConductor;
  };

  delete = async (conductorId: string) => {
    try {
      await prisma.conductor_availability.deleteMany({
        where: { conductor_id: conductorId }
      });
    } catch (e) {
      console.log(`Conductor with id '${conductorId} not found.'`);
      console.log(e);
    }
  };
}

export const availabilityModel = new AvailabilityModel();
