import { conductorModel } from '../../conductors/models/conductor';
import { Conductor } from '../../conductors/models/types';
import { prisma } from '../../config/connection';
import { Territory } from '../../territories/models/types';
import {
  InvalidParams,
  LastRegistryNotFount,
  TerritoryIsLocked
} from './errors';
import {
  PartialRegistry,
  PartialRegistryEntity,
  Registry,
  RegistryEntity
} from './types';

class RegistryModel {
  async getLastByTerritory(territory: Territory) {
    const lastRegistry = await prisma.registries.findFirst({
      where: { territory_id: territory.id },
      include: {
        conductor: true
      },
      orderBy: {
        date_assigned: 'desc'
      },
      take: 1
    });

    if (lastRegistry === null)
      throw new LastRegistryNotFount(
        `Last registry of territory number '${territory.number}' not found`
      );

    return {
      territory,
      lastRegistry: this.#toModel({
        entity: lastRegistry,
        assignedTo: conductorModel.toModel(lastRegistry.conductor)
      })
    };
  }

  async getAllByTerritory(territory: Territory) {
    const registries = await prisma.registries.findMany({
      where: { territory_id: territory.id },
      include: { conductor: true }
    });
    return {
      territory,
      registries: registries.map((r) =>
        this.#toModel({
          entity: r,
          assignedTo: conductorModel.toModel(r.conductor)
        })
      )
    };
  }

  async create(data: Registry) {
    if (!data.territoryAssigned?.id || !data.assignedTo?.id)
      throw new InvalidParams('Invalid params to create registry');

    if (data.territoryAssigned.isLocked)
      throw new TerritoryIsLocked(
        `Territory number '${data.territoryAssigned.number}' is assigned now`
      );

    const newRegistry = await prisma.registries.create({
      data: {
        territory_id: data.territoryAssigned.id,
        conductor_id: data.assignedTo.id,
        date_assigned: data.dateAssigned,
        date_completed: data.dateCompleted
      }
    });

    await this.#assignedLockTerritory(data.territoryAssigned.id);
    await this.#updateLastDateAssignedConductor(
      data.assignedTo.id,
      data.dateAssigned
    );

    return this.#toModel({
      entity: newRegistry,
      territoryAssigned: data.territoryAssigned,
      assignedTo: data.assignedTo
    });
  }

  async closeLastRecord(territory: Territory) {
    if (!territory.id)
      throw new InvalidParams('Invalid param to close registry');

    const lastRegistryId = await this.#getLastRegistryIdByTerritory(territory);

    const dateCompleted = new Date();
    const closedRegistry = await prisma.registries.update({
      where: { id: lastRegistryId },
      data: {
        date_completed: dateCompleted
      }
    });

    this.#assignedUnlockTerritory(territory.id, dateCompleted);

    return this.#toModel({ entity: closedRegistry });
  }

  async updateLastRegistry(territory: Territory, data: PartialRegistry) {
    const lastRegistryId = await this.#getLastRegistryIdByTerritory(territory);
    await prisma.registries.update({
      where: { id: lastRegistryId },
      data: {
        ...this.#toEntity(data)
      }
    });
  }

  async update(id: string, data: PartialRegistry) {
    const updatedRegistry = await prisma.registries.update({
      where: { id },
      data: {
        ...this.#toEntity(data)
      }
    });

    return this.#toModel({ entity: updatedRegistry });
  }

  async delete(id: string) {
    const exist = await this.#ensureExistRegistry(id);
    exist && (await prisma.registries.delete({ where: { id } }));
  }

  #toModel({
    entity,
    territoryAssigned,
    assignedTo
  }: {
    entity: RegistryEntity;
    territoryAssigned?: Territory;
    assignedTo?: Conductor;
  }): Registry {
    return {
      id: entity.id,
      territoryAssigned: territoryAssigned,
      assignedTo: assignedTo,
      dateAssigned: entity.date_assigned,
      dateCompleted:
        entity.date_completed === null ? undefined : entity.date_completed
    };
  }

  #toEntity(model: PartialRegistry): PartialRegistryEntity {
    return {
      id: model.id,
      territory_id: model.territoryAssigned?.id,
      conductor_id: model.assignedTo?.id,
      date_assigned: model.dateAssigned,
      date_completed: model.dateCompleted
    };
  }

  async #ensureExistRegistry(id: string) {
    return (await prisma.registries.findUnique({ where: { id } })) !== null;
  }

  async #assignedLockTerritory(id: string) {
    await prisma.territories.update({
      where: { id },
      data: { assigned_lock: true }
    });
  }

  async #assignedUnlockTerritory(id: string, dateAssigned: Date) {
    await prisma.territories.update({
      where: { id },
      data: { last_date_completed: dateAssigned, assigned_lock: false }
    });
  }

  async #getLastRegistryIdByTerritory(territory: Territory) {
    const id = await prisma.registries.findMany({
      where: { territory_id: territory.id },
      select: { id: true },
      orderBy: {
        date_assigned: 'desc'
      },
      take: 1
    });

    return id[0].id;
  }

  async #updateLastDateAssignedConductor(id: string, dateAssigned: Date) {
    await prisma.conductors.update({
      where: { id },
      data: { last_date_assigned: dateAssigned }
    });
  }
}

export const registryModel = new RegistryModel();
