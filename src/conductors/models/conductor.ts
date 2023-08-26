import { prisma } from '../../config/connection';

export enum Days {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

export enum Moments {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT'
}

type Available = {
  frequency: string;
  moment: Moments;
};

export enum Privilegies {
  GROUP_OVERSEER = 'GROUP_OVERSEER',
  GROUP_SERVANT = 'GROUP_SERVANT',
  QUALIFIED_BROTHER = 'QUALIFIED_BROTHER'
}

type Availability = Partial<Record<Days, Available>>;

export type Conductor = {
  name: string;
  mobilePhone: string;
  serviceGroup: number;
  privilegie: Privilegies;
  lastDateAssigned?: Date;
  availability?: Availability;
};

export type PartialConductor = Partial<Conductor>;

export class ConductorModel {
  static async getAll() {
    const conductors = await prisma.conductors.findMany();
    return conductors;
  }

  static async getById(id: string) {
    const conductor = await prisma.conductors.findUnique({
      where: { id },
      include: { Availability: true }
    });

    return conductor;
  }

  static async create(data: Conductor) {
    const availableArray = ConductorModel.#getAvailableArray(data.availability);
    const newConductor = await prisma.conductors.create({
      data: {
        name: data.name,
        mobile_phone: data.mobilePhone,
        service_group: data.serviceGroup,
        privilege: data.privilegie,
        last_date_assigned: data.lastDateAssigned ?? new Date(),
        Availability: {
          create: availableArray
        }
      }
    });

    return newConductor;
  }

  static async update(id: string, data: PartialConductor) {
    const dataMapper = {
      name: data.name,
      mobile_phone: data.mobilePhone,
      service_group: data.serviceGroup,
      privilege: data.privilegie,
      last_date_assigned: data.lastDateAssigned ?? new Date()
    };

    const updatedConductor = await prisma.conductors.update({
      where: { id },
      data: {
        ...dataMapper
      }
    });

    if (data.availability) {
      ConductorModel.#updateAvailability(
        updatedConductor.id,
        data.availability
      );
    }

    return updatedConductor;
  }

  static async delete(id: string) {
    const exist = await ConductorModel.#existConductor(id);
    exist && (await prisma.conductors.delete({ where: { id } }));
  }

  static #getAvailableArray(availability: Availability | undefined) {
    if (typeof availability === 'undefined') return [];

    const availableArray: { day: string; frequency: string; moment: string }[] =
      [];
    for (const key in availability) {
      const available = availability[key as Days];
      if (available) {
        availableArray.push({
          day: key,
          frequency: available.frequency,
          moment: available.moment
        });
      }
    }

    return availableArray;
  }

  static async #updateAvailability(
    coductorId: string,
    availability: Availability
  ) {
    for (const key in availability) {
      const available = availability[key as Days];
      available &&
        (await prisma.availability.update({
          where: {
            conductor_id_day: {
              conductor_id: coductorId,
              day: key
            }
          },
          data: {
            frequency: available.frequency,
            moment: available.moment
          }
        }));
    }
  }

  static async #existConductor(id: string) {
    return (await prisma.conductors.findUnique({ where: { id } })) !== null;
  }
}
