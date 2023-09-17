import { Request, Response } from 'express';
import { asyncErrorHandler } from '../../shared/controllers/async-error-handler';
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
        cursor as string | undefined,
        future
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
