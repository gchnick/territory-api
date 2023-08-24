import { Request, Response } from 'express';
import { TerritoryModel } from '../models/territory';
import {
  ensurePartialTerritoryIsValid,
  ensureTerritoryIsValid
} from '../shemas/territory';
export class TerritoryController {
  static async getAll(_: Request, response: Response) {
    const territories = await TerritoryModel.getAll();
    response.json(territories);
  }

  static async getById(request: Request, response: Response) {
    const { number } = request.params;
    const numberTerritory = Number(number);
    const territory = await TerritoryModel.getById(numberTerritory);
    if (territory) return response.json(territory);
    response.status(404).json({ message: 'Territory not found' });
  }

  static async create(request: Request, response: Response) {
    const body = {
      ...request.body,
      lastDateCompleted: new Date(request.body.lastDateCompleted)
    };

    const result = ensureTerritoryIsValid(body);

    if (!result.success) {
      return response
        .status(400)
        .json({ error: JSON.parse(result.error.message) });
    }

    const newTerritory = await TerritoryModel.create(result.data);

    response.status(201).json(newTerritory);
  }

  static async update(request: Request, response: Response) {
    const body = {
      ...request.body,
      lastDateCompleted: new Date(request.body.lastDateCompleted)
    };

    const result = ensurePartialTerritoryIsValid(body);

    if (!result.success) {
      return response
        .status(400)
        .json({ error: JSON.parse(result.error.message) });
    }

    const { number } = request.params;
    const numberTerritory = Number(number);

    const updatedTerritory = await TerritoryModel.update(
      numberTerritory,
      result.data
    );

    return response.json(updatedTerritory);
  }

  static async delete(request: Request, response: Response) {
    const { id } = request.params;

    await TerritoryModel.delete(id);

    return response.status(204).json(null);
  }
}
