import { Request, Response } from 'express';
import { conductorModel } from '../../conductors/models/conductor';
import { meetingPlaceModel } from '../../meeting-place/models/meeting-place';
import { asyncErrorHandler } from '../../shared/controllers/async-error-handler';
import { assignamentModel } from '../models/assignament';
import { programModel } from '../models/program';
import { Program } from '../models/types';

class AssignamentController {
  getPagination = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { cursor, current, future } = request.query;

      if (current) {
        const currentAssignament = await assignamentModel.getCurrent();
        return response.json(currentAssignament);
      }

      const program = await programModel.getCurrent();

      const page = await assignamentModel.getPagination(
        program,
        cursor as string | undefined,
        future
      );
      response.json(page);
    }
  );

  create = asyncErrorHandler(async (request: Request, response: Response) => {
    let program: Program;
    const { programId } = request.params;
    const { meetingPlaceId, conductorId } = request.body;
    const _conductorId = String(conductorId);
    const _meetingPlaceId = String(meetingPlaceId);
    delete request.body.meetingPlaceId;
    delete request.body.conductorId;

    if (!programId) {
      program = await programModel.getCurrent();
    } else {
      program = await programModel.getById(programId);
    }

    request.body.meetingPlace =
      await meetingPlaceModel.getById(_meetingPlaceId);
    request.body.conductor = await conductorModel.getById(_conductorId);

    const newAssignament = await assignamentModel.create(program, request.body);
    response.status(201).json(newAssignament);
  });

  update = asyncErrorHandler(async (request: Request, response: Response) => {
    const { id } = request.params;

    const assignament = await assignamentModel.getById(id);

    const updatedAssignament = await assignamentModel.update(
      assignament,
      request.body
    );

    response.json(updatedAssignament);
  });

  delete = async (request: Request, response: Response) => {
    const { id } = request.params;

    await assignamentModel.delete(id);
    response.status(204).send(null);
  };
}

export const assignamentController = new AssignamentController();
