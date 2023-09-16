import { conductorModel } from '../../conductors/models/conductor';
import {
  Conductor,
  Entity as ConductorEntity
} from '../../conductors/models/types';
import { prisma } from '../../config/connection';
import { InvalidParams } from '../../shared/models/error-model';
import { TerritoryIsLocked } from '../../territories/models/errors';
import { territoryModel } from '../../territories/models/territory';
import {
  Territory,
  Entity as TerritoryEntity
} from '../../territories/models/types';
import { LastRegistryNotFount, RegistryNotFount } from './errors';
import {
  PartialRegistry,
  PartialRegistryEntity,
  Period,
  Registry,
  RegistryEntity
} from './types';

class RegistryModel {
  getById = async (id: string) => {
    const registry = await prisma.registries.findUnique({
      where: { id },
      include: { territory: true, conductor: true }
    });

    if (registry === null) {
      throw new RegistryNotFount(`Registry with id '${id} not found'`);
    }

    return this.#toModel({
      entity: registry,
      territoryAssigned: registry.territory,
      assignedTo: registry.conductor
    });
  };

  getLastByTerritory = async (territory: Territory) => {
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
      assignedTo: lastRegistry.conductor
    });

    registryModel.territoryAssigned = territory;

    return registryModel;
  };

  getNoCompletionByTerritory = async (territory: Territory) => {
    const noCompletionRegistry = await prisma.registries.findFirst({
      where: { territory_id: territory.id, completion_date: null },
      include: {
        conductor: true
      },
      orderBy: {
        assigned_date: 'desc'
      },
      take: 1
    });

    if (noCompletionRegistry === null)
      throw new LastRegistryNotFount(
        `There in no uncompleted registry of territory number '${territory.number}'`
      );

    const registryModel = this.#toModel({
      entity: noCompletionRegistry,
      assignedTo: noCompletionRegistry.conductor
    });

    registryModel.territoryAssigned = territory;

    return registryModel;
  };

  getAllByTerritory = async (territory: Territory) => {
    const registries = await prisma.registries.findMany({
      where: { territory_id: territory.id },
      include: { conductor: true }
    });
    return {
      territory,
      registries: registries.map((r) =>
        this.#toModel({
          entity: r,
          assignedTo: r.conductor
        })
      )
    };
  };

  create = async (currentPeriod: Period, data: Registry) => {
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

    const registryModel = this.#toModel({ entity: newRegistry });
    registryModel.territoryAssigned = data.territoryAssigned;
    registryModel.assignedTo = data.assignedTo;

    return registryModel;
  };

  completionLast = async (noCompletionRegistry: Registry) => {
    if (!noCompletionRegistry.territoryAssigned?.id) {
      throw new InvalidParams('Invalid params to complete last registry');
    }

    const completionDate = new Date();

    await territoryModel.assignedUnlock(
      noCompletionRegistry.territoryAssigned.id,
      completionDate
    );

    const completionRegistry = await prisma.registries.update({
      where: { id: noCompletionRegistry.id },
      data: {
        completion_date: completionDate
      }
    });

    return this.#toModel({ entity: completionRegistry });
  };

  updateLastRegistry = async (
    lastRegistry: Registry,
    data: PartialRegistry
  ) => {
    if (!lastRegistry.territoryAssigned?.id) {
      throw new InvalidParams('Invalid params to complete last registry');
    }

    if (data.completionDate) {
      await territoryModel.assignedUnlock(
        lastRegistry.territoryAssigned.id,
        data.completionDate
      );
    }

    const updatedRegistry = await prisma.registries.update({
      where: { id: lastRegistry.id },
      data: {
        ...this.#toEntity(data)
      }
    });

    return this.#toModel({ entity: updatedRegistry });
  };

  update = async (registry: Registry, data: PartialRegistry) => {
    if (!registry.territoryAssigned?.id) {
      throw new InvalidParams('Invalid params to update registry');
    }

    if (data.completionDate) {
      await territoryModel.assignedUnlock(
        registry.territoryAssigned.id,
        data.completionDate
      );
    }

    const updatedRegistry = await prisma.registries.update({
      where: { id: registry.id },
      data: {
        ...this.#toEntity(data)
      }
    });

    return this.#toModel({ entity: updatedRegistry });
  };

  delete = async (id: string) => {
    try {
      await prisma.registries.delete({ where: { id } });
    } catch (e) {
      console.log(`Registry with id '${id}' not found`);
      console.log(e);
    }
  };

  #toModel({
    entity,
    territoryAssigned,
    assignedTo
  }: {
    entity: RegistryEntity;
    territoryAssigned?: TerritoryEntity;
    assignedTo?: ConductorEntity;
  }): Registry {
    let territory: Territory | undefined;
    let conductor: Conductor | undefined;

    if (territoryAssigned) {
      territory = territoryModel.toModel(territoryAssigned);
    }

    if (assignedTo) {
      conductor = conductorModel.toModel(assignedTo);
    }

    return {
      id: entity.id,
      territoryAssigned: territory,
      assignedTo: conductor,
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
