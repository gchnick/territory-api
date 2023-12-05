/* eslint-disable indent */
import { prisma } from '../../config/connection';
import {
  completionRegistryQuery,
  createQuery as createRegistryQuery,
} from '../../registries/models/queries';
import { ASSIGNAMENS_FOR_PAGE, PROGRAMS_FOR_PAGE } from './constants';
import { AssignamentEntity, ProgramEntity } from './types';

// PROGRAMS QUERIES
export const getProgramByIdQuery = (id: string) => {
  return prisma.programs.findUnique({
    where: { id },
  });
};

export const getProgramByIdWithAssignamentsQuery = (id: string) => {
  return prisma.programs.findUnique({
    where: { id },
    include: {
      assignaments: { include: { conductor: true, meeting_place: true } },
    },
  });
};

export const getProgramByAssignamentQuery = (assignamentId: string) => {
  return prisma.programs.findMany({
    where: { assignaments: { some: { id: assignamentId } } },
    orderBy: { created_at: 'desc' },
    take: 1,
  });
};

export const getCurrentProgramQuery = (today: Date) => {
  return prisma.programs.findMany({
    where: {
      since_week: {
        lte: today, // since_week is minor or equal to today
      },
      until_week: {
        gte: today, // until_week is mayor or equal to today
      },
    },
    include: {
      assignaments: { include: { conductor: true, meeting_place: true } },
    },
    orderBy: { created_at: 'desc' },
    take: 1,
  });
};

export const getProgramBetweenDaysQuery = (sinceWeek: Date) => {
  return prisma.programs.findMany({
    where: {
      since_week: {
        lte: sinceWeek, // since_week is menor or equal to sinceWeek
      },
      until_week: {
        gte: sinceWeek, // since_week is mayor or equel to untilWeek
      },
    },
    orderBy: { created_at: 'desc' },
    take: 1,
  });
};

export const getProgramPaginationQuery = (
  today: Date,
  future: unknown,
  cursor?: string
) => {
  return !cursor
    ? prisma.programs.findMany({
        take: PROGRAMS_FOR_PAGE,
        where: future
          ? { since_week: { gte: today }, until_week: { gte: today } }
          : { since_week: { lte: today } },
        include: { assignaments: true },
        orderBy: { created_at: 'desc' },
      })
    : prisma.programs.findMany({
        take: PROGRAMS_FOR_PAGE,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: future
          ? { since_week: { gte: today }, until_week: { gte: today } }
          : { since_week: { lte: today } },
        include: { assignaments: true },
        orderBy: { created_at: 'desc' },
      });
};

export const createProgramQuery = (sinceWeek: Date, untilWeek: Date) => {
  return prisma.programs.create({
    data: {
      since_week: sinceWeek,
      until_week: untilWeek,
    },
  });
};

export const updateProgramQuery = (
  id: string,
  data: Partial<ProgramEntity>
) => {
  return prisma.programs.update({
    where: { id },
    data: {
      ...data,
    },
  });
};

export const publishedProgramQuery = (id: string) => {
  return prisma.programs.update({
    where: { id },
    data: {
      published: true,
    },
  });
};

export const deleteProgramQuery = (id: string) => {
  return prisma.programs.delete({ where: { id } });
};

export const setUpdatedAtProgramQuery = (id: string, updated_at: Date) => {
  return prisma.programs.update({
    where: { id },
    data: { updated_at },
  });
};

// ASSIGNAMENTS QUERIES

export const getAssignamentByIdQuery = (id: string) => {
  return prisma.assignaments.findUnique({
    where: { id },
    include: { conductor: true, meeting_place: true, program: true },
  });
};

export const getCurrentAssignamentQuery = (currentMoment: Date) => {
  return prisma.assignaments.findMany({
    where: { date: { lte: currentMoment } },
    include: { conductor: true, meeting_place: true, program: true },
    orderBy: { date: 'desc' },
    take: 1,
  });
};

export const getAssignamentPaginationQuery = (
  untilWeek: Date,
  future: unknown,
  cursor?: string
) => {
  return !cursor
    ? prisma.assignaments.findMany({
        take: ASSIGNAMENS_FOR_PAGE,
        where: future
          ? { date: { gte: untilWeek } }
          : { date: { lte: untilWeek } },
        include: { conductor: true, meeting_place: true },
        orderBy: { date: 'asc' },
      })
    : prisma.assignaments.findMany({
        take: ASSIGNAMENS_FOR_PAGE,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: future
          ? { date: { gte: untilWeek } }
          : { date: { lte: untilWeek } },
        include: { conductor: true, meeting_place: true },
        orderBy: { date: 'asc' },
      });
};

export const createAssignamentQuery = (
  date: Date,
  coductor_id: string,
  meeting_place_id: string,
  program_id: string
) => {
  return prisma.assignaments.create({
    data: {
      date,
      coductor_id,
      meeting_place_id,
      program_id,
    },
    include: { conductor: true, meeting_place: true },
  });
};

export const createAssignamentWithNewRegistryQuery = (
  registry_period_id: string,
  territory_id: string,
  conductor_id: string,
  assigned_date: Date,
  meeting_place_id: string,
  program_id: string
) => {
  return [
    ...createRegistryQuery(
      registry_period_id,
      territory_id,
      conductor_id,
      assigned_date,
      undefined
    ),
    createAssignamentQuery(
      assigned_date,
      conductor_id,
      meeting_place_id,
      program_id
    ),
  ];
};

export const updateAssignamentQuery = (
  id: string | undefined,
  programId: string,
  programPublished: boolean,
  data: Partial<AssignamentEntity>
) => {
  const updateQuery = prisma.assignaments.update({
    where: { id },
    data: {
      ...data,
    },
  });
  return programPublished
    ? [updateQuery, setUpdatedAtProgramQuery(programId, new Date())]
    : [updateQuery];
};

export const coveredAssignementQuery = (
  id: string,
  tertitoryId: string,
  noCompletionRegistryId: string,
  completionDate: Date
) => {
  return [
    ...completionRegistryQuery(
      tertitoryId,
      noCompletionRegistryId,
      completionDate
    ),
    prisma.assignaments.update({ where: { id }, data: { covered: true } }),
  ];
};

export const deleteAssignamentQuery = (id: string) => {
  return prisma.assignaments.delete({ where: { id } });
};
