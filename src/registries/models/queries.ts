import { setLastDateAssignedQuery } from '../../conductors/models/queries';
import { prisma } from '../../config/connection';
import {
  assignedLockQuery,
  assignedUnlockQuery
} from '../../territories/models/queries';
import { PartialRegistryEntity } from './types';

export const getAllByTerritoryQuery = (territory_id: string | undefined) => {
  return prisma.registries.findMany({
    where: { territory_id },
    include: { conductor: true }
  });
};

export const getByIdQuery = (id: string) => {
  return prisma.registries.findUnique({
    where: { id },
    include: { territory: true, conductor: true }
  });
};

export const lastRegistryQuery = (territory_id: string | undefined) => {
  return prisma.registries.findFirst({
    where: { territory_id },
    include: {
      conductor: true
    },
    orderBy: {
      assigned_date: 'desc'
    },
    take: 1
  });
};

export const noCompletionByTerritoryQuery = (
  territory_id: string | undefined
) => {
  return prisma.registries.findFirst({
    where: { territory_id, completion_date: null },
    include: {
      conductor: true
    },
    orderBy: {
      assigned_date: 'desc'
    },
    take: 1
  });
};

export const registriesPerPeriodCountQuery = (
  registry_period_id: string | undefined,
  territory_id: string | undefined
) => {
  return prisma.registries.count({
    where: { registry_period_id, territory_id }
  });
};

export const createQuery = (
  registry_period_id: string,
  territory_id: string,
  conductor_id: string,
  assigned_date: Date,
  completion_date: Date | undefined
) => {
  return [
    prisma.registries.create({
      data: {
        registry_period_id,
        territory_id,
        conductor_id,
        assigned_date,
        completion_date
      }
    }),
    assignedLockQuery(territory_id),
    setLastDateAssignedQuery(conductor_id, assigned_date)
  ];
};

export const completionRegistryQuery = (
  territoryId: string,
  noCompletionRegistryId: string,
  completion_date: Date
) => {
  return [
    assignedUnlockQuery(territoryId, completion_date),
    prisma.registries.update({
      where: { id: noCompletionRegistryId },
      data: {
        completion_date
      }
    })
  ];
};

export const updateLastRegistryQuery = (
  territoryId: string,
  lastRegistryId: string | undefined,
  data: PartialRegistryEntity
) => {
  const updateQuery = prisma.registries.update({
    where: { id: lastRegistryId },
    data: {
      ...data
    }
  });
  return data.completion_date
    ? [assignedUnlockQuery(territoryId, data.completion_date), updateQuery]
    : [updateQuery];
};

export const deleteQuery = (id: string | undefined) => {
  return prisma.registries.delete({ where: { id } });
};
