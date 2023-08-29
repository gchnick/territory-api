import { Request, Response } from 'express';
import { asyncErrorHandler } from '../../shared/controllers/async-error-handler';
import { ConductorModel } from '../models/conductor';

export class ConductorController {
  static getAll = asyncErrorHandler(async (_: Request, response: Response) => {
    const conductors = await ConductorModel.getAll();
    response.json(conductors);
  });

  static getById = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { id } = request.params;
      const conductor = await ConductorModel.getById(id);
      response.json(conductor);
    }
  );

  static create = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const newConductor = await ConductorModel.create(request.body);
      response.status(201).json(newConductor);
    }
  );

  static update = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { id } = request.params;

      const updatedConductor = await ConductorModel.update(id, request.body);
      response.json(updatedConductor);
    }
  );

  static delete = async (request: Request, response: Response) => {
    const { id } = request.params;
    await ConductorModel.delete(id);
    response.status(204).json(null);
  };
}
