import { prisma } from '../../config/connection';
import { toAvailabilityModel } from '../../shared/models/availability';
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
  getAll = async () => {
    const conductors = await prisma.conductors.findMany({
      include: { availability: true }
    });
    return conductors.map((c) => this.toModel(c));
  };

  getById = async (id: string) => {
    const conductor = await prisma.conductors.findUnique({
      where: { id },
      include: { availability: true }
    });

    if (conductor === null) {
      throw new ConductorNotFount(`Conductor id '${id} not fount'`);
    }

    return this.toModel(conductor);
  };

  create = async (data: Conductor) => {
    const unique = await this.#isMobilePhoneUnique(data.mobilePhone);

    if (!unique) {
      throw new MobilePhoneAlreadyRegistry(
        `Mobile phone '${data.mobilePhone}' already registry`
      );
    }
    const newConductor = await prisma.conductors.create({
      data: {
        name: data.name,
        mobile_phone: data.mobilePhone,
        service_group: data.serviceGroup,
        privilege: data.privilege,
        last_date_assigned: data.lastDateAssigned ?? new Date()
      }
    });

    return this.toModel(newConductor);
  };

  update = async (conductor: Conductor, data: PartialConductor) => {
    const updatedConductor = await prisma.conductors.update({
      where: { id: conductor.id },
      include: { availability: true },
      data: {
        ...this.#toEntity(data)
      }
    });

    return this.toModel(updatedConductor);
  };

  delete = async (id: string) => {
    try {
      await prisma.conductors.delete({ where: { id } });
    } catch (e) {
      console.log(`Conductor with id '${id}' not found`);
      console.log(e);
    }
  };

  toModel(entity: Entity): Conductor {
    return this.#checkIsConductorWithAvailability(entity)
      ? {
          id: entity.id,
          name: entity.name,
          mobilePhone: entity.mobile_phone,
          serviceGroup: entity.service_group,
          lastDateAssigned: entity.last_date_assigned,
          privilege: Privilegies[entity.privilege as Privilegies],
          availability: toAvailabilityModel(entity.availability)
        }
      : {
          id: entity.id,
          name: entity.name,
          mobilePhone: entity.mobile_phone,
          serviceGroup: entity.service_group,
          lastDateAssigned: entity.last_date_assigned,
          privilege: Privilegies[entity.privilege as Privilegies]
        };
  }

  /**
   * Check guard
   */
  #checkIsConductorWithAvailability(
    entity: Entity
  ): entity is ConductorWithAvailability {
    return (
      typeof (entity as ConductorWithAvailability)?.availability !== 'undefined'
    );
  }

  #toEntity(model: PartialConductor): Partial<ConductorEntity> {
    return {
      name: model.name,
      mobile_phone: model.mobilePhone,
      service_group: model.serviceGroup,
      privilege: model.privilege,
      last_date_assigned: model.lastDateAssigned ?? new Date()
    };
  }

  async #isMobilePhoneUnique(phone: string) {
    const number = await prisma.conductors.findUnique({
      select: { mobile_phone: true },
      where: { mobile_phone: phone }
    });
    return number === null;
  }
}

export const conductorModel = new ConductorModel();
