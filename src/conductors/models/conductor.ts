import { prisma } from '../../config/connection';
import {
  getAvailableCreateQuery,
  toAvailabilityModel
} from '../../shared/models/availability';
import { Availability, Days } from '../../shared/models/types';
import { ConductorNotFount, MobilePhoneAlreadyRegistry } from './errors';
import {
  Conductor,
  ConductorEntity,
  ConductorWithAvailability,
  Entity,
  PartialConductor,
  Privilegies
} from './types';

class ConductorModel {
  async getAll() {
    const conductors = await prisma.conductors.findMany();
    return conductors.map((c) => this.toModel(c));
  }

  async getById(id: string) {
    const conductor = await prisma.conductors.findUnique({
      where: { id },
      include: { availability: true }
    });

    if (conductor === null) {
      throw new ConductorNotFount(`Conductor id '${id} not fount'`);
    }

    return this.toModel(conductor);
  }

  async create(data: Conductor) {
    const unique = await this.#ensureIsMobilePhoneUnique(data.mobilePhone);

    if (!unique) {
      throw new MobilePhoneAlreadyRegistry(
        `Mobile phone '${data.mobilePhone}' already registry`
      );
    }
    const availableQuery = getAvailableCreateQuery(data.availability);
    const newConductor = await prisma.conductors.create({
      data: {
        name: data.name,
        mobile_phone: data.mobilePhone,
        service_group: data.serviceGroup,
        privilege: data.privilegie,
        last_date_assigned: data.lastDateAssigned ?? new Date(),
        availability: {
          create: availableQuery
        }
      }
    });

    return this.toModel(newConductor);
  }

  async update(id: string, data: PartialConductor) {
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
        availability: {
          updateMany: availabilityQueries
        }
      }
    });

    return this.toModel(updatedConductor);
  }

  async delete(id: string) {
    const exist = await this.#ensureExistConductorId(id);

    if (exist) {
      await prisma.conductors.delete({ where: { id } });
    }
  }

  async #ensureExistConductorId(id: string) {
    const exist = await prisma.conductors.findUnique({
      select: { id: true },
      where: { id }
    });

    return exist !== null;
  }

  async #ensureIsMobilePhoneUnique(phone: string) {
    const number = await prisma.conductors.findUnique({
      select: { mobile_phone: true },
      where: { mobile_phone: phone }
    });
    return number === null;
  }

  /**
   * Method to get `prisma queries` to update availability fields in database
   */
  #getAvailabilityUpdateQueries(
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

  toModel(entity: Entity): Conductor {
    return this.#checkIsConductorWithAvailability(entity)
      ? {
          id: entity.id,
          name: entity.name,
          mobilePhone: entity.mobile_phone,
          serviceGroup: entity.service_group,
          lastDateAssigned: entity.last_date_assigned,
          privilegie: Privilegies[entity.privilege as Privilegies],
          availability: toAvailabilityModel(entity.Availability)
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
  #checkIsConductorWithAvailability(
    entity: Entity
  ): entity is ConductorWithAvailability {
    return (
      typeof (entity as ConductorWithAvailability).Availability !== 'undefined'
    );
  }

  #toEntity(model: PartialConductor): Partial<ConductorEntity> {
    return {
      name: model.name,
      mobile_phone: model.mobilePhone,
      service_group: model.serviceGroup,
      privilege: model.privilegie,
      last_date_assigned: model.lastDateAssigned ?? new Date()
    };
  }
}

export const conductorModel = new ConductorModel();
