import { Request, Response } from 'express';
import { ConductorModel } from '../../conductors/models/conductor';
import { asyncErrorHandler } from '../../shared/controllers/async-error-handler';
import { TerritoryModel } from '../../territories/models/territory';
import { RegistryModel } from '../models/registry';

export class RegistryController {
  static getByTerritory = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { territoryId } = request.params;
      const numberTerritory = Number(territoryId);

      const territory = await TerritoryModel.getByNumber(numberTerritory);
      const { last } = request.query;

      if (last) {
        const lastRegistry = await RegistryModel.getLastByTerritory(territory);
        response.json(lastRegistry);
      }

      if (!last) {
        const territories = await RegistryModel.getAllByTerritory(territory);
        response.json(territories);
      }
    }
  );

  static create = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { territoryId } = request.params;
      const numberTerritory = Number(territoryId);
      const { assignedToId } = request.body;
      const conductorId = String(assignedToId);
      delete request.body.assignedTo;

      request.body.territoryAssigned =
        await TerritoryModel.getByNumber(numberTerritory);
      request.body.assignedTo = await ConductorModel.getById(conductorId);

      const newRegistry = await RegistryModel.create(request.body);

      response.status(201).json(newRegistry);
    }
  );

  static close = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { territoryId } = request.params;
      const numberTerritory = Number(territoryId);

      const territory = await TerritoryModel.getByNumber(numberTerritory);
      const closedRegistry = await RegistryModel.closeLastRecord(territory);

      response.status(200).json(closedRegistry);
    }
  );

  static update = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { territoryId, id } = request.params;
      const numberTerritory = Number(territoryId);
      const { last } = request.query;

      if (last) {
        const territory = await TerritoryModel.getByNumber(numberTerritory);
        const updatedLastRegistry = await RegistryModel.updateLastRegistry(
          territory,
          request.body
        );

        response.status(200).json(updatedLastRegistry);
      }

      if (!last) {
        const updatedRegistry = await RegistryModel.update(id, request.body);
        response.status(200).json(updatedRegistry);
      }
    }
  );

  static delete = async (request: Request, response: Response) => {
    const { id } = request.params;

    await RegistryModel.delete(id);

    response.status(204).send(null);
  };
}
