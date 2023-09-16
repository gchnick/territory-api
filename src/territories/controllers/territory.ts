import { Request, Response } from 'express';
import { meetingPlaceModel } from '../../meeting-place/models/meeting-place';
import { asyncErrorHandler } from '../../shared/controllers/async-error-handler';
import { territoryModel } from '../models/territory';

class TerritoryController {
  getAll = asyncErrorHandler(async (request: Request, response: Response) => {
    const { available } = request.query;

    if (available) {
      const availablesTerritories = await territoryModel.getAvailables();
      return response.json(availablesTerritories);
    }

    const territories = await territoryModel.getAll();
    response.json(territories);
  });

  getByNumber = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { number } = request.params;
      const numberTerritory = Number(number);

      const territory = await territoryModel.getByNumber(numberTerritory);

      response.json(territory);
    }
  );

  create = asyncErrorHandler(async (request: Request, response: Response) => {
    const newTerritory = await territoryModel.create(request.body);

    response.status(201).json(newTerritory);
  });

  update = asyncErrorHandler(async (request: Request, response: Response) => {
    const { number } = request.params;
    const numberTerritory = Number(number);

    const updatedTerritory = await territoryModel.update(
      numberTerritory,
      request.body
    );

    response.status(200).json(updatedTerritory);
  });

  setMeetingPlaces = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { number } = request.params;
      const territoryNumber = Number(number);
      const { meetingPlaces } = request.body;

      const territory = await territoryModel.getByNumber(territoryNumber);

      const updatedTerritory = await meetingPlaceModel.set(
        territory,
        meetingPlaces
      );
      response.status(200).json(updatedTerritory);
    }
  );

  delete = async (request: Request, response: Response) => {
    const { id } = request.params;

    await territoryModel.delete(id);

    response.status(204).send(null);
  };
}

export const territoryController = new TerritoryController();
