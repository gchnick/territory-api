import { Request, Response } from 'express';
import { asyncErrorHandler } from '../../shared/controllers/async-error-handler';
import { conductorModel } from '../models/conductor';

class ConductorController {
  getAll = asyncErrorHandler(async (_: Request, response: Response) => {
    const conductors = await conductorModel.getAll();
    response.json(conductors);
  });

  getById = asyncErrorHandler(async (request: Request, response: Response) => {
    const { id } = request.params;
    const conductor = await conductorModel.getById(id);
    response.json(conductor);
  });

  create = asyncErrorHandler(async (request: Request, response: Response) => {
    const newConductor = await conductorModel.create(request.body);
    response.status(201).json(newConductor);
  });

  update = asyncErrorHandler(async (request: Request, response: Response) => {
    const { id } = request.params;

    const conductor = await conductorModel.getById(id);

    const updatedConductor = await conductorModel.update(
      conductor,
      request.body
    );
    response.json(updatedConductor);
  });

  delete = async (request: Request, response: Response) => {
    const { id } = request.params;
    await conductorModel.delete(id);
    response.status(204).json(null);
  };
}

export const conductorController = new ConductorController();
