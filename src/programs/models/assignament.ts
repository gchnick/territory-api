import { conductorModel } from '../../conductors/models/conductor';
import { ConductorEntity } from '../../conductors/models/types';
import { prisma } from '../../config/connection';
import { meetingPlaceModel } from '../../meeting-place/models/meeting-place';
import { MeetingPlaceEntity } from '../../meeting-place/types';
import { periodModel } from '../../registries/models/period';
import { Registry } from '../../registries/models/types';
import { InvalidParams } from '../../shared/models/error-model';
import { Territory } from '../../territories/models/types';
import { ASSIGNAMENS_FOR_PAGE, ASSIGNAMENT_CURSOR_INDEX } from './constants';
import { AssignamentNotFount, DateOutsideProgram } from './errors';
import { programModel } from './program';
import {
  coveredAssignementQuery,
  createAssignamentQuery,
  createAssignamentWithNewRegistryQuery,
  deleteAssignamentQuery,
  getAssignamentByIdQuery,
  getAssignamentPaginationQuery,
  getCurrentAssignamentQuery,
  updateAssignamentQuery,
} from './queries';
import {
  Assignament,
  AssignamentEntity,
  AssignamentEntityWithConductorAndMeetingPlace,
  PartialAssignament,
  Program,
} from './types';

class AssignamentModel {
  getById = async (id: string) => {
    const [assignament] = await prisma.$transaction([
      getAssignamentByIdQuery(id),
    ]);

    if (assignament === null) {
      throw new AssignamentNotFount(`The assignament with '${id}' not found'`);
    }

    const {
      id: _id,
      sinceWeek,
      untilWeek,
    } = programModel.toModel(assignament.program);

    return {
      ...this.toModel({
        entity: assignament,
        conductor: assignament.conductor,
        meetingPlace: assignament.meeting_place,
      }),
      program: {
        id: _id,
        sinceWeek,
        untilWeek,
      },
    };
  };

  getCurrent = async () => {
    const currentMoment = new Date();
    const [currentAssignament] = await prisma.$transaction([
      getCurrentAssignamentQuery(currentMoment),
    ]);

    const assignament = currentAssignament[0];

    const {
      id: _id,
      sinceWeek,
      untilWeek,
    } = programModel.toModel(assignament.program);

    return {
      ...this.toModel({
        entity: assignament,
        conductor: assignament.conductor,
        meetingPlace: assignament.meeting_place,
      }),
      program: {
        id: _id,
        sinceWeek,
        untilWeek,
      },
    };
  };

  getPagination = async (
    program: Program,
    cursor: string | undefined,
    future: unknown
  ) => {
    let page: AssignamentEntityWithConductorAndMeetingPlace[] = [];

    if (!cursor) {
      [page] = await prisma.$transaction([
        getAssignamentPaginationQuery(program.untilWeek, future),
      ]);
    }

    if (cursor) {
      [page] = await prisma.$transaction([
        getAssignamentPaginationQuery(program.untilWeek, future, cursor),
      ]);
    }

    if (page.length === 0) {
      throw new AssignamentNotFount('Page of assignaments not fount.');
    }

    const _cursor =
      page.length === ASSIGNAMENS_FOR_PAGE
        ? page[ASSIGNAMENT_CURSOR_INDEX].id
        : undefined;

    return page.length === 1
      ? {
          ...this.toModel({
            entity: page[0],
            conductor: page[0].conductor,
            meetingPlace: page[0].meeting_place,
          }),
        }
      : {
          data: page.map(a =>
            this.toModel({
              entity: a,
              conductor: a.conductor,
              meetingPlace: a.meeting_place,
            })
          ),
          cursor: _cursor,
        };
  };

  /**
   * Create a new assignament in a spacific program
   * @param program Program to which the assignament belongs
   * @param assignament New assignament data
   * @returns Assignament model with conductor and meeting place data
   */
  create = async (program: Program, assignament: Assignament) => {
    const programId = program.id;
    const meetingPlaceId = assignament.meetingPlace.id;
    const conductorId = assignament.conductor.id;

    if (!programId || !meetingPlaceId || !conductorId) {
      throw new InvalidParams('Invalid params to create assignament');
    }

    if (
      assignament.date < program.sinceWeek ||
      assignament.date > program.untilWeek
    ) {
      throw new DateOutsideProgram(
        `The date '${assignament.date}' is outside the range specified in the program`
      );
    }

    const territory = await meetingPlaceModel.getTerritory(
      assignament.meetingPlace
    );
    const territoryId = territory.id;

    if (!territoryId) {
      throw new InvalidParams('Invalid params to create assignament');
    }

    if (!territory.isLocked) {
      const currentPeriod = await periodModel.getCurrent();
      const periodId = currentPeriod.id as string;

      const query = createAssignamentWithNewRegistryQuery(
        periodId,
        territoryId,
        conductorId,
        assignament.date,
        meetingPlaceId,
        programId
      );

      const [newAssignament] = await prisma.$transaction(query);

      const assignamentModel = structuredClone(assignament);
      assignamentModel.id = newAssignament.id;

      return assignamentModel;
    }

    const [newAssignament] = await prisma.$transaction([
      createAssignamentQuery(
        assignament.date,
        conductorId,
        meetingPlaceId,
        programId
      ),
    ]);

    return this.toModel({
      entity: newAssignament,
      conductor: newAssignament.conductor,
      meetingPlace: newAssignament.meeting_place,
    });
  };

  /**
   * To update a assignament. If program is published this method update
   * the field `updatedAt` of program.
   * @param assignament assignament to update
   * @param data data to set the assignament
   * @returns Promise of `Assignament`
   */
  update = async (assignament: Assignament, data: PartialAssignament) => {
    const program = await programModel.getByAssignament(assignament);

    if (!program.id) {
      throw new InvalidParams('Invalid params to update assignament');
    }

    if (
      data.date &&
      (data.date < program.sinceWeek || data.date > program.untilWeek)
    ) {
      throw new DateOutsideProgram(
        `The date '${data.date}' is outside the range specified in the program`
      );
    }

    await prisma.$transaction(
      updateAssignamentQuery(
        assignament.id,
        program.id,
        program.published,
        this.#toEntity(data)
      )
    );

    const assignamentModel: Assignament = {
      ...assignament,
      ...data,
    };

    return assignamentModel;
  };

  covered = async (
    assignament: Assignament,
    territory: Territory,
    noCompletionRegistry: Registry,
    completionDate: Date
  ) => {
    if (!assignament.id || !territory.id || !noCompletionRegistry.id) {
      throw new InvalidParams('Invalid params to update covered assignament');
    }

    if (assignament.date > completionDate) {
      throw new InvalidParams('The completion date is incongruent');
    }

    await prisma.$transaction(
      coveredAssignementQuery(
        assignament.id,
        territory.id,
        noCompletionRegistry.id,
        completionDate
      )
    );

    const coveredAssignament = structuredClone(assignament);
    coveredAssignament.covered = true;
    return coveredAssignament;
  };

  delete = async (id: string) => {
    try {
      await prisma.$transaction([deleteAssignamentQuery(id)]);
    } catch (e) {
      console.log(`Assignament with id '${id}' not found`);
      console.log(e);
    }
  };

  toModel({
    entity,
    conductor,
    meetingPlace,
  }: {
    entity: AssignamentEntity;
    conductor: ConductorEntity;
    meetingPlace: MeetingPlaceEntity;
  }): Assignament {
    return {
      id: entity.id,
      date: entity.date,
      conductor: conductorModel.toModel(conductor),
      meetingPlace: meetingPlaceModel.toModel(meetingPlace),
      covered: entity.covered,
    };
  }

  #toEntity(model: PartialAssignament): Partial<AssignamentEntity> {
    return {
      date: model.date,
      coductor_id: model.conductor?.id,
      meeting_place_id: model.meetingPlace?.id,
      covered: model.covered,
    };
  }
}

export const assignamentModel = new AssignamentModel();
