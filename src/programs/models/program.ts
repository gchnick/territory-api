import { prisma } from '../../config/connection';
import { currentDateWithoutHours, increseDays } from '../../shared/models/date';
import { assignamentModel } from './assignament';
import { PROGRAMS_FOR_PAGE, PROGRAM_CURSOR_INDEX } from './constants';
import { ProgramNotFount } from './errors';
import {
  Entity,
  PartialProgram,
  Program,
  ProgramEntity,
  ProgramEntityWithAssignaments
} from './types';

class ProgramModel {
  getById = async (id: string) => {
    const program = await prisma.programs.findUnique({
      where: { id },
      include: { assignaments: true }
    });

    if (program === null) {
      throw new ProgramNotFount(`Program with id '${id}' not found`);
    }

    return this.toModel(program);
  };

  getCurrent = async () => {
    const currentDate = currentDateWithoutHours();

    const currentProgram = await prisma.programs.findMany({
      where: {
        since_week: {
          lte: currentDate // menor o igual
        },
        until_week: {
          gte: currentDate // mayor o igual
        }
      },
      include: { assignaments: true },
      orderBy: { created_at: 'desc' },
      take: 1
    });

    if (currentProgram.length === 0) {
      throw new ProgramNotFount(
        `Current program not fount. Please, create a program`
      );
    }

    return this.toModel(currentProgram[0]);
  };

  getPagination = async (cursor: string | undefined, future: any) => {
    const currentDate = currentDateWithoutHours();
    let page: Entity[] = [];

    if (!cursor) {
      page = await prisma.programs.findMany({
        take: PROGRAMS_FOR_PAGE,
        where: future ? {} : { since_week: { lte: currentDate } },
        include: { assignaments: true },
        orderBy: { created_at: 'desc' }
      });
    }

    if (cursor) {
      page = await prisma.programs.findMany({
        take: PROGRAMS_FOR_PAGE,
        skip: 1,
        cursor: {
          id: cursor
        },
        where: future ? {} : { since_week: { lte: currentDate } },
        include: { assignaments: true },
        orderBy: { created_at: 'desc' }
      });
    }

    if (page.length === 0) {
      throw new ProgramNotFount(`Page of programs not fount.`);
    }

    return page.length === 1
      ? page[0]
      : {
          data: page.map((p) => this.toModel(p)),
          cursor: page[PROGRAM_CURSOR_INDEX].id
        };
  };

  create = async (sinceWeek: Date, daysDuration: number) => {
    const newProgra = await prisma.programs.create({
      data: {
        since_week: sinceWeek,
        until_week: increseDays(sinceWeek, daysDuration)
      }
    });

    return this.toModel(newProgra);
  };

  update = async (program: Program, data: PartialProgram) => {
    const updatedProgram = await prisma.programs.update({
      where: { id: program.id },
      data: {
        ...this.#toEntity(data)
      }
    });

    return this.toModel(updatedProgram);
  };

  delete = async (id: string) => {
    try {
      await prisma.programs.delete({ where: { id } });
    } catch (e) {
      console.log(`Programs with id '${id}' not found`);
      console.log(e);
    }
  };

  async setUpdatedAt(id: string, updateAt: Date) {
    await prisma.programs.update({
      where: { id },
      data: { updated_at: updateAt }
    });
  }

  async setUpdatedAtNow(id: string) {
    await this.setUpdatedAt(id, new Date());
  }

  toModel(entity: ProgramEntity): Program {
    return this.#checkIsProgramWithAssignaments(entity)
      ? {
          id: entity.id,
          createdAt: entity.created_at,
          updatedAt: entity.updated_at,
          sinceWeek: entity.since_week,
          untilWeek: entity.until_week,
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
          untilWeek: entity.until_week
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
