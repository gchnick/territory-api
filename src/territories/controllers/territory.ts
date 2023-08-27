import { UUID } from 'crypto';
import { Request, Response } from 'express';
import { RequestBody } from '../../shared/controllers/request-body';
import { PartialTerritory, Territory } from '../models/territory';
import { TerritoryModel } from '../models/territory.model';

export class TerritoryController {
  static async getAll(_: Request, response: Response) {
    const territories = await TerritoryModel.getAll();
    return response.json(territories);
  }

  static async getByNumber(request: Request, response: Response) {
    const { number } = request.params;
    const numberTerritory = Number(number);

    const territory = await TerritoryModel.getByNumber(numberTerritory);

    return response.json(territory);
  }

  static async create(request: RequestBody<Territory>, response: Response) {
    const newTerritory = await TerritoryModel.create(request.body);

    return response.status(201).json(newTerritory);
  }

  static async update(
    request: RequestBody<PartialTerritory>,
    response: Response
  ) {
    const { number } = request.params;
    const numberTerritory = Number(number);

    const updatedTerritory = await TerritoryModel.update(
      numberTerritory,
      request.body
    );

    return response.status(200).json(updatedTerritory);
  }

  static async delete(request: Request<{ id: UUID }>, response: Response) {
    const { id } = request.params;

    await TerritoryModel.delete(id);

    return response.status(204).send(null);
  }
}
