import { prisma } from '../../config/connection';
import { ConductorNotFount, MobilePhoneAlreadyRegistry } from './errors';
import {
  Availability,
  AvailabilityEntity,
  Conductor,
  ConductorEntity,
  ConductorWithAvailability,
  Days,
  Entity,
  Moments,
  PartialConductor,
  Privilegies
} from './types';

export class ConductorModel {
  static async getAll() {
    const conductors = await prisma.conductors.findMany();
    return conductors.map((c) => this.toModel(c));
  }

  static async getById(id: string) {
    const conductor = await prisma.conductors.findUnique({
      where: { id },
      include: { Availability: true }
    });

    if (conductor === null) {
      throw new ConductorNotFount(`Conductor id '${id} not fount'`);
    }

    return this.toModel(conductor);
  }

  static async create(data: Conductor) {
    const unique = await this.#ensureIsMobilePhoneUnique(data.mobilePhone);

    if (!unique) {
      throw new MobilePhoneAlreadyRegistry(
        `Mobile phone '${data.mobilePhone}' already registry`
      );
    }
    const availableQuery = this.#getAvailableCreateQuery(data.availability);
    const newConductor = await prisma.conductors.create({
      data: {
        name: data.name,
        mobile_phone: data.mobilePhone,
        service_group: data.serviceGroup,
        privilege: data.privilegie,
        last_date_assigned: data.lastDateAssigned ?? new Date(),
        Availability: {
          create: availableQuery
        }
      }
    });

    return this.toModel(newConductor);
  }

  static async update(id: string, data: PartialConductor) {
    const exist = await this.#ensureExistConductorId(id);

    if (!exist) {
      throw new ConductorNotFount(`Conductor with id '${id}' not fount`);
    }

    const availabilityQueries = this.#getAvailabilityUpdateQueries(
      id,
      data.availability
    );

    const updatedConductor = await prisma.conductors.update({
      where: { id },
      data: {
        ...this.#toEntity(data),
        Availability: {
          updateMany: availabilityQueries
        }
      }
    });

    return this.toModel(updatedConductor);
  }

  static async delete(id: string) {
    const exist = await this.#ensureExistConductorId(id);

    if (exist) {
      await prisma.conductors.delete({ where: { id } });
    }
  }

  static async #ensureExistConductorId(id: string) {
    const exist = await prisma.conductors.findUnique({
      select: { id: true },
      where: { id }
    });

    return exist !== null;
  }

  static async #ensureIsMobilePhoneUnique(phone: string) {
    const number = await prisma.conductors.findUnique({
      select: { mobile_phone: true },
      where: { mobile_phone: phone }
    });
    return number === null;
  }

  /**
   * Method to get `prisma queries` to update availability fields in database
   */
  static #getAvailabilityUpdateQueries(
    coductorId: string,
    availability: Availability | undefined
  ) {
    if (!availability) return [];

    const prismaQueries: {
      where: { conductor_id: string; AND: { day: string } };
      data: { frequency: string; moment: string };
    }[] = [];

    for (const key in availability) {
      const available = availability[key as Days];
      available &&
        prismaQueries.push({
          where: {
            conductor_id: coductorId,
            AND: { day: key }
          },
          data: {
            frequency: available.frequency,
            moment: available.moment
          }
        });
    }

    return prismaQueries;
  }

  static #getAvailableCreateQuery(availability: Availability | undefined) {
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

  static toModel(entity: Entity): Conductor {
    return this.#checkIsConductorWithAvailability(entity)
      ? {
          id: entity.id,
          name: entity.name,
          mobilePhone: entity.mobile_phone,
          serviceGroup: entity.service_group,
          lastDateAssigned: entity.last_date_assigned,
          privilegie: Privilegies[entity.privilege as Privilegies],
          availability: this.#toAvailabilityModel(entity.Availability)
        }
      : {
          id: entity.id,
          name: entity.name,
          mobilePhone: entity.mobile_phone,
          serviceGroup: entity.service_group,
          lastDateAssigned: entity.last_date_assigned,
          privilegie: Privilegies[entity.privilege as Privilegies]
        };
  }

  /**
   * Check guard
   */
  static #checkIsConductorWithAvailability(
    entity: Entity
  ): entity is ConductorWithAvailability {
    return (
      typeof (entity as ConductorWithAvailability).Availability !== 'undefined'
    );
  }

  static #toAvailabilityModel(entity: AvailabilityEntity[] | undefined) {
    if (!entity) return undefined;
    const record: Availability = {};

    entity.forEach((a) => {
      record[a.day as Days] = {
        frequency: a.frequency,
        moment: Moments[a.moment as Moments]
      };
    });

    return record;
  }

  static #toEntity(model: PartialConductor): Partial<ConductorEntity> {
    return {
      name: model.name,
      mobile_phone: model.mobilePhone,
      service_group: model.serviceGroup,
      privilege: model.privilegie,
      last_date_assigned: model.lastDateAssigned ?? new Date()
    };
  }
}
