import { conductorModel } from '../../conductors/models/conductor';
import {
  Conductor,
  Entity as ConductorEntity,
} from '../../conductors/models/types';
import { prisma } from '../../config/connection';
import { currentDateWithoutHours } from '../../shared/models/date';
import { InvalidParams } from '../../shared/models/error-model';
import { TerritoryIsLocked } from '../../territories/models/errors';
import { territoryModel } from '../../territories/models/territory';
import {
  Territory,
  Entity as TerritoryEntity,
} from '../../territories/models/types';
import { MAX_REGISTRIES_PER_PERIOD } from './constants';
import {
  LastRegistryNotFount,
  MaximumRecordsReached,
  RegistryNotFount,
} from './errors';
import {
  completionRegistryQuery,
  createQuery,
  deleteQuery,
  getAllByTerritoryQuery,
  getByIdQuery,
  lastRegistryQuery,
  noCompletionByTerritoryQuery,
  registriesPerPeriodCountQuery,
  updateLastRegistryQuery,
} from './queries';
import {
  PartialRegistry,
  PartialRegistryEntity,
  Period,
  Registry,
  RegistryEntity,
} from './types';

class RegistryModel {
  getById = async (id: string) => {
    const [registry] = await prisma.$transaction([getByIdQuery(id)]);

    if (registry === null) {
      throw new RegistryNotFount(`Registry with id '${id} not found'`);
    }

    return this.#toModel({
      entity: registry,
      territoryAssigned: registry.territory,
      assignedTo: registry.conductor,
    });
  };

  getLastByTerritory = async (territory: Territory) => {
    const [lastRegistry] = await prisma.$transaction([
      lastRegistryQuery(territory.id),
    ]);

    if (lastRegistry === null)
      throw new LastRegistryNotFount(
        `Last registry of territory number '${territory.number}' not found`
      );

    const registryModel = this.#toModel({
      entity: lastRegistry,
      assignedTo: lastRegistry.conductor,
    });

    registryModel.territoryAssigned = territory;

    return registryModel;
  };

  getNoCompletionByTerritory = async (territory: Territory) => {
    const [noCompletionRegistry] = await prisma.$transaction([
      noCompletionByTerritoryQuery(territory.id),
    ]);

    if (noCompletionRegistry === null)
      throw new LastRegistryNotFount(
        `There in no uncompleted registry of territory number '${territory.number}'`
      );

    const registryModel = this.#toModel({
      entity: noCompletionRegistry,
      assignedTo: noCompletionRegistry.conductor,
    });

    registryModel.territoryAssigned = territory;

    return registryModel;
  };

  getAllByTerritory = async (territory: Territory) => {
    const [registries] = await prisma.$transaction([
      getAllByTerritoryQuery(territory.id),
    ]);

    return {
      territory,
      registries: registries.map(r =>
        this.#toModel({
          entity: r,
          assignedTo: r.conductor,
        })
      ),
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

    const [registriesPerPeriod] = await prisma.$transaction([
      registriesPerPeriodCountQuery(
        currentPeriod.id,
        data.territoryAssigned.id
      ),
    ]);

    if (registriesPerPeriod >= MAX_REGISTRIES_PER_PERIOD) {
      throw new MaximumRecordsReached(
        'The maximum of registrations per period has been reached'
      );
    }

    const [newRegistry] = await prisma.$transaction(
      createQuery(
        currentPeriod.id,
        data.territoryAssigned.id,
        data.assignedTo.id,
        data.assignedDate,
        data.completionDate
      )
    );

    const registryModel = structuredClone(data);
    registryModel.id = newRegistry.id;

    return registryModel;
  };

  completionLast = async (noCompletionRegistry: Registry) => {
    if (!noCompletionRegistry.territoryAssigned?.id) {
      throw new InvalidParams('Invalid params to complete last registry');
    }

    const noCompletionRegistryId = noCompletionRegistry.territoryAssigned.id;

    const completionDate = currentDateWithoutHours();

    await prisma.$transaction(
      completionRegistryQuery(
        noCompletionRegistry.territoryAssigned.id,
        noCompletionRegistryId,
        completionDate
      )
    );

    const completionRegistry = structuredClone(noCompletionRegistry);
    completionRegistry.completionDate = completionDate;

    return completionRegistry;
  };

  update = async (registry: Registry, data: PartialRegistry) => {
    if (!registry.territoryAssigned?.id) {
      throw new InvalidParams('Invalid params to complete last registry');
    }

    const test = {
      ...registry,
      ...data,
    };

    if (test.completionDate && test.assignedDate > test.completionDate) {
      throw new InvalidParams('Competion date is incongruent');
    }

    await prisma.$transaction(
      updateLastRegistryQuery(
        registry.territoryAssigned.id,
        registry.id,
        this.#toEntity(data)
      )
    );

    const updatedRegistry = {
      ...registry,
      ...data,
    };

    return updatedRegistry;
  };

  delete = async (id: string) => {
    try {
      await prisma.$transaction([deleteQuery(id)]);
    } catch (e) {
      console.log(`Registry with id '${id}' not found`);
      console.log(e);
    }
  };

  #toModel({
    entity,
    territoryAssigned,
    assignedTo,
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
      completionDate: entity.completion_date ?? undefined,
    };
  }

  #toEntity(model: PartialRegistry): PartialRegistryEntity {
    return {
      id: model.id,
      territory_id: model.territoryAssigned?.id,
      conductor_id: model.assignedTo?.id,
      assigned_date: model.assignedDate,
      completion_date: model.completionDate,
    };
  }
}

export const registryModel = new RegistryModel();
