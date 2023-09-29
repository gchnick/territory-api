import { prisma } from '../../config/connection';
import { firthHours, increseDays, lastHours } from '../../shared/models/date';
import { InvalidParams } from '../../shared/models/error-model';
import { assignamentModel } from './assignament';
import { PROGRAMS_FOR_PAGE, PROGRAM_CURSOR_INDEX } from './constants';
import { AlreadyProgram, ProgramNotFount } from './errors';
import {
  createProgramQuery,
  deleteProgramQuery,
  getCurrentProgramQuery,
  getProgramBetweenDaysQuery,
  getProgramByAssignamentQuery,
  getProgramByIdQuery,
  getProgramPaginationQuery,
  publishedProgramQuery,
  updateProgramQuery
} from './queries';
import {
  Assignament,
  Entity,
  PartialProgram,
  Program,
  ProgramEntity,
  ProgramEntityWithAssignaments
} from './types';

class ProgramModel {
  getById = async (id: string) => {
    const [program] = await prisma.$transaction([getProgramByIdQuery(id)]);

    if (program === null) {
      throw new ProgramNotFount(`Program with id '${id}' not found`);
    }

    return this.toModel(program);
  };

  getByAssignament = async (assignament: Assignament) => {
    if (!assignament.id) {
      throw new InvalidParams(`Invalid params to get program`);
    }
    const [program] = await prisma.$transaction([
      getProgramByAssignamentQuery(assignament.id)
    ]);

    if (program.length === 0) {
      throw new ProgramNotFount(
        `Program with assignament id '${assignament.id}' not found`
      );
    }

    return this.toModel(program[0]);
  };

  getCurrent = async () => {
    const today = new Date();

    const [currentProgram] = await prisma.$transaction([
      getCurrentProgramQuery(today)
    ]);

    if (currentProgram.length === 0) {
      throw new ProgramNotFount(
        `Current program not fount. Please, create a program`
      );
    }

    return this.toModel(currentProgram[0]);
  };

  getPagination = async (future: any, cursor?: string) => {
    const today = firthHours(new Date());
    let page: Entity[] = [];

    if (!cursor) {
      [page] = await prisma.$transaction([
        getProgramPaginationQuery(today, future)
      ]);
    }

    if (cursor) {
      [page] = await prisma.$transaction([
        getProgramPaginationQuery(today, future, cursor)
      ]);
    }

    if (page.length === 0) {
      throw new ProgramNotFount(`Page of programs not fount.`);
    }

    const _cursor =
      page.length === PROGRAMS_FOR_PAGE
        ? page[PROGRAM_CURSOR_INDEX].id
        : undefined;

    return page.length === 1
      ? page[0]
      : {
          data: page.map((p) => this.toModel(p)),
          cursor: _cursor
        };
  };

  create = async (sinceWeek: Date, daysDuration: number) => {
    let untilWeek = increseDays(sinceWeek, daysDuration);
    untilWeek = lastHours(untilWeek);

    const [exist] = await prisma.$transaction([
      getProgramBetweenDaysQuery(sinceWeek)
    ]);

    if (exist[0]?.id) {
      throw new AlreadyProgram(
        `There is already a program during the days: [${exist[0].since_week} - ${exist[0].until_week}]`
      );
    }

    const [newProgra] = await prisma.$transaction([
      createProgramQuery(sinceWeek, untilWeek)
    ]);

    return this.toModel(newProgra);
  };

  update = async (program: Program, data: PartialProgram) => {
    if (!program.id) {
      throw new InvalidParams(`Invalid params to update program`);
    }

    const test = {
      ...program,
      ...data
    };

    if (test.sinceWeek >= test.untilWeek) {
      throw new InvalidParams(
        `The start and end dates of the program are incongruent`
      );
    }

    const [updatedProgram] = await prisma.$transaction([
      updateProgramQuery(program.id, this.#toEntity(data))
    ]);

    return this.toModel(updatedProgram);
  };

  published = async (program: Program) => {
    if (!program.id) {
      throw new InvalidParams(`Invalid params to set published program`);
    }

    const [programPublished] = await prisma.$transaction([
      publishedProgramQuery(program.id)
    ]);

    return this.toModel(programPublished);
  };

  delete = async (id: string) => {
    try {
      await prisma.$transaction([deleteProgramQuery(id)]);
    } catch (e) {
      console.log(`Programs with id '${id}' not found`);
      console.log(e);
    }
  };

  toModel(entity: ProgramEntity): Program {
    return this.#checkIsProgramWithAssignaments(entity)
      ? {
          id: entity.id,
          createdAt: entity.created_at,
          updatedAt: entity.updated_at,
          sinceWeek: entity.since_week,
          untilWeek: entity.until_week,
          published: entity.published,
          assignaments: entity.assignaments.map((a) =>
            assignamentModel.toModel({
              entity: a,
              conductor: a.conductor,
              meetingPlace: a.meeting_place
            })
          )
        }
      : {
          id: entity.id,
          createdAt: entity.created_at,
          updatedAt: entity.updated_at,
          sinceWeek: entity.since_week,
          untilWeek: entity.until_week,
          published: entity.published
        };
  }

  #toEntity(model: PartialProgram): Partial<ProgramEntity> {
    return {
      since_week: model.sinceWeek,
      until_week: model.untilWeek
    };
  }

  /**
   * Check guard
   */
  #checkIsProgramWithAssignaments(
    entity: Entity
  ): entity is ProgramEntityWithAssignaments {
    return (
      typeof (entity as ProgramEntityWithAssignaments).assignaments !==
      'undefined'
    );
  }
}

export const programModel = new ProgramModel();
