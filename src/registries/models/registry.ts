import { conductorModel } from '../../conductors/models/conductor';
import { Conductor } from '../../conductors/models/types';
import { prisma } from '../../config/connection';
import { InvalidParams } from '../../shared/models/error-model';
import { territoryModel } from '../../territories/models/territory';
import { Territory } from '../../territories/models/types';
import { LastRegistryNotFount, TerritoryIsLocked } from './errors';
import {
  PartialRegistry,
  PartialRegistryEntity,
  Period,
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
        assigned_date: 'desc'
      },
      take: 1
    });

    if (lastRegistry === null)
      throw new LastRegistryNotFount(
        `Last registry of territory number '${territory.number}' not found`
      );

    const registryModel = this.#toModel({
      entity: lastRegistry,
      assignedTo: conductorModel.toModel(lastRegistry.conductor)
    });

    registryModel.territoryAssigned = territory;

    return registryModel;
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

  async create(currentPeriod: Period, data: Registry) {
    if (
      !currentPeriod.id ||
      !data.territoryAssigned?.id ||
      !data.assignedTo?.id
    )
      throw new InvalidParams('Invalid params to create registry');

    if (data.territoryAssigned.isLocked)
      throw new TerritoryIsLocked(
        `Territory number '${data.territoryAssigned.number}' is assigned now`
      );

    // TODO: Implement 4 records maximun for territory in a period

    const newRegistry = await prisma.registries.create({
      data: {
        registry_period_id: currentPeriod.id,
        territory_id: data.territoryAssigned.id,
        conductor_id: data.assignedTo.id,
        assigned_date: data.assignedDate,
        completion_date: data.completionDate
      }
    });

    await territoryModel.assignedLock(data.territoryAssigned.id);
    await conductorModel.setLastDateAssigned(
      data.assignedTo.id,
      data.assignedDate
    );

    return this.#toModel({
      entity: newRegistry,
      territoryAssigned: data.territoryAssigned,
      assignedTo: data.assignedTo
    });
  }

  async completeLast(lastRegistry: Registry) {
    if (!lastRegistry.territoryAssigned?.id)
      throw new InvalidParams('Invalid params to complete last registry');

    const dateCompleted = new Date();
    const closedRegistry = await prisma.registries.update({
      where: { id: lastRegistry.id },
      data: {
        completion_date: dateCompleted
      }
    });

    await territoryModel.assignedUnlock(
      lastRegistry.territoryAssigned.id,
      dateCompleted
    );

    return this.#toModel({ entity: closedRegistry });
  }

  async updateLastRegistry(lastRegistry: Registry, data: PartialRegistry) {
    await prisma.registries.update({
      where: { id: lastRegistry.id },
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
    try {
      await prisma.registries.delete({ where: { id } });
    } catch (e) {
      console.log(`Registry with id '${id}' not found`);
      console.log(e);
    }
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
      assignedDate: entity.assigned_date,
      completionDate: entity.completion_date ?? undefined
    };
  }

  #toEntity(model: PartialRegistry): PartialRegistryEntity {
    return {
      id: model.id,
      territory_id: model.territoryAssigned?.id,
      conductor_id: model.assignedTo?.id,
      assigned_date: model.assignedDate,
      completion_date: model.completionDate
    };
  }
}

export const registryModel = new RegistryModel();
