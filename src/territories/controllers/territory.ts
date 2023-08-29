import { Request, Response } from 'express';
import { asyncErrorHandler } from '../../shared/controllers/async-error-handler';
import { TerritoryModel } from '../models/territory';

export class TerritoryController {
  static getAll = asyncErrorHandler(async (_: Request, response: Response) => {
    const territories = await TerritoryModel.getAll();
    response.json(territories);
  });

  static getByNumber = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { number } = request.params;
      const numberTerritory = Number(number);

      const territory = await TerritoryModel.getByNumber(numberTerritory);

      response.json(territory);
    }
  );

  static create = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const newTerritory = await TerritoryModel.create(request.body);

      response.status(201).json(newTerritory);
    }
  );

  static update = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { number } = request.params;
      const numberTerritory = Number(number);

      const updatedTerritory = await TerritoryModel.update(
        numberTerritory,
        request.body
      );

      response.status(200).json(updatedTerritory);
    }
  );

  static delete = async (request: Request, response: Response) => {
    const { id } = request.params;

    await TerritoryModel.delete(id);

    response.status(204).send(null);
  };
}
