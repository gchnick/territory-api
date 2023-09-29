import { Request, Response } from 'express';
import { conductorModel } from '../../conductors/models/conductor';
import { meetingPlaceModel } from '../../meeting-place/models/meeting-place';
import { asyncErrorHandler } from '../../shared/controllers/async-error-handler';
import { assignamentModel } from '../models/assignament';
import { programModel } from '../models/program';

class ProgramController {
  getPagination = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { cursor, current, future } = request.query;

      if (current) {
        const currentProgram = await programModel.getCurrent();
        return response.json(currentProgram);
      }

      const page = await programModel.getPagination(
        future,
        cursor as string | undefined
      );
      response.json(page);
    }
  );

  get = asyncErrorHandler(async (request: Request, response: Response) => {
    const { id } = request.params;

    const program = await programModel.getById(id);
    response.json(program);
  });

  create = asyncErrorHandler(async (request: Request, response: Response) => {
    const { sinceWeek, daysDuration } = request.body;
    const newProgram = await programModel.create(sinceWeek, daysDuration);
    response.status(201).json(newProgram);
  });

  published = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { id } = request.params;

      let program = await programModel.getById(id);
      program = await programModel.published(program);
      response.json(program);
    }
  );

  addAssignament = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { programId } = request.params;
      const { meetingPlaceId, conductorId } = request.body;
      const _conductorId = String(conductorId);
      const _meetingPlaceId = String(meetingPlaceId);
      delete request.body.meetingPlaceId;
      delete request.body.conductorId;

      const program = await programModel.getById(programId);

      request.body.meetingPlace =
        await meetingPlaceModel.getById(_meetingPlaceId);
      request.body.conductor = await conductorModel.getById(_conductorId);

      const newAssignament = await assignamentModel.create(
        program,
        request.body
      );
      response.status(201).json(newAssignament);
    }
  );

  update = asyncErrorHandler(async (request: Request, response: Response) => {
    const { id } = request.params;

    const program = await programModel.getById(id);

    const updatedProgram = await programModel.update(program, request.body);
    response.json(updatedProgram);
  });

  delete = async (request: Request, response: Response) => {
    const { id } = request.params;

    await programModel.delete(id);
    response.status(204).send(null);
  };
}

export const programController = new ProgramController();
