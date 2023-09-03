import { Request, Response } from 'express';
import { asyncErrorHandler } from '../../shared/controllers/async-error-handler';
import { territoryModel } from '../models/territory';

export class TerritoryController {
  static getAll = asyncErrorHandler(async (_: Request, response: Response) => {
    const territories = await territoryModel.getAll();
    response.json(territories);
  });

  static getByNumber = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { number } = request.params;
      const numberTerritory = Number(number);

      const territory = await territoryModel.getByNumber(numberTerritory);

      response.json(territory);
    }
  );

  static create = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const newTerritory = await territoryModel.create(request.body);

      response.status(201).json(newTerritory);
    }
  );

  static update = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { number } = request.params;
      const numberTerritory = Number(number);

      const updatedTerritory = await territoryModel.update(
        numberTerritory,
        request.body
      );

      response.status(200).json(updatedTerritory);
    }
  );

  static delete = async (request: Request, response: Response) => {
    const { id } = request.params;

    await territoryModel.delete(id);

    response.status(204).send(null);
  };
}
