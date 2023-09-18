import { conductorModel } from '../../conductors/models/conductor';
import { Entity as ConductorEntity } from '../../conductors/models/types';
import { prisma } from '../../config/connection';
import { meetingPlaceModel } from '../../meeting-place/models/meeting-place';
import { Entity as MeetingPlaceEntity } from '../../meeting-place/types';
import { InvalidParams } from '../../shared/models/error-model';
import { ASSIGNAMENS_FOR_PAGE, ASSIGNAMENT_CURSOR_INDEX } from './constants';
import { AssignamentNotFount } from './errors';
import { programModel } from './program';
import {
  Assignament,
  AssignamentEntity,
  AssignamentEntityWithConductorAndMeetingPlace,
  PartialAssignament,
  Program
} from './types';

class AssignamentModel {
  getById = async (id: string) => {
    const assignament = await prisma.assignaments.findUnique({
      where: { id },
      include: { conductor: true, meeting_place: true, program: true }
    });

    if (assignament === null) {
      throw Error();
    }

    return {
      ...this.toModel({
        entity: assignament,
        conductor: assignament.conductor,
        meetingPlace: assignament.meeting_place
      }),
      program: programModel.toModel(assignament.program)
    };
  };

  getCurrent = async () => {
    const currentMoment = new Date();
    const currentAssignament = await prisma.assignaments.findMany({
      where: { date: { lte: currentMoment } },
      include: { conductor: true, meeting_place: true, program: true },
      orderBy: { date: 'desc' },
      take: 1
    });

    const assignament = currentAssignament[0];

    return {
      ...this.toModel({
        entity: assignament,
        conductor: assignament.conductor,
        meetingPlace: assignament.meeting_place
      }),
      program: programModel.toModel(assignament.program)
    };
  };

  getPagination = async (
    program: Program,
    cursor: string | undefined,
    future: any
  ) => {
    let page: AssignamentEntityWithConductorAndMeetingPlace[] = [];

    if (!cursor) {
      page = await prisma.assignaments.findMany({
        take: ASSIGNAMENS_FOR_PAGE,
        where: future
          ? { date: { gte: program.untilWeek } }
          : { date: { lte: program.untilWeek } },
        include: { conductor: true, meeting_place: true },
        orderBy: { date: 'asc' }
      });
    }

    if (cursor) {
      page = await prisma.assignaments.findMany({
        take: ASSIGNAMENS_FOR_PAGE,
        skip: 1,
        cursor: {
          id: cursor
        },
        where: future
          ? { date: { gte: program.untilWeek } }
          : { date: { lte: program.untilWeek } },
        include: { conductor: true, meeting_place: true },
        orderBy: { date: 'asc' }
      });
    }

    if (page.length === 0) {
      throw new AssignamentNotFount(`Page of assignaments not fount.`);
    }

    return page.length === 1
      ? page[0]
      : {
          data: page.map((a) =>
            this.toModel({
              entity: a,
              conductor: a.conductor,
              meetingPlace: a.meeting_place
            })
          ),
          cursor: page[ASSIGNAMENT_CURSOR_INDEX].id
        };
  };

  create = async (program: Program, assignament: Assignament) => {
    if (
      !program.id ||
      !assignament.meetingPlace.id ||
      !assignament.conductor.id
    ) {
      throw new InvalidParams(`Invalid params to create assignament`);
    }

    const newAssignament = await prisma.assignaments.create({
      data: {
        date: assignament.date,
        coductor_id: assignament.conductor.id,
        meeting_place_id: assignament.meetingPlace.id,
        program_id: program.id
      },
      include: { conductor: true, meeting_place: true }
    });

    return this.toModel({
      entity: newAssignament,
      conductor: newAssignament.conductor,
      meetingPlace: newAssignament.meeting_place
    });
  };

  update = async (assignament: Assignament, data: PartialAssignament) => {
    const updatedAssignament = await prisma.assignaments.update({
      where: { id: assignament.id },
      data: {
        ...this.#toEntity(data)
      }
    });

    const assignamentModel: Assignament = {
      id: updatedAssignament.id,
      date: updatedAssignament.date,
      conductor: assignament.conductor,
      meetingPlace: assignament.meetingPlace
    };

    return assignamentModel;
  };

  delete = async (id: string) => {
    try {
      await prisma.assignaments.delete({ where: { id } });
    } catch (e) {
      console.log(`Assignament with id '${id}' not found`);
      console.log(e);
    }
  };

  toModel({
    entity,
    conductor,
    meetingPlace
  }: {
    entity: AssignamentEntity;
    conductor: ConductorEntity;
    meetingPlace: MeetingPlaceEntity;
  }): Assignament {
    return {
      id: entity.id,
      date: entity.date,
      conductor: conductorModel.toModel(conductor),
      meetingPlace: meetingPlaceModel.toModel(meetingPlace)
    };
  }

  #toEntity(model: PartialAssignament): Partial<AssignamentEntity> {
    return {
      date: model.date,
      coductor_id: model.conductor?.id,
      meeting_place_id: model.meetingPlace?.id
    };
  }
}

export const assignamentModel = new AssignamentModel();
