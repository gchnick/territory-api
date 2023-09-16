import { Request, Response } from 'express';
import { conductorModel } from '../../conductors/models/conductor';
import { asyncErrorHandler } from '../../shared/controllers/async-error-handler';
import { territoryModel } from '../../territories/models/territory';
import { periodModel } from '../models/period';
import { registryModel } from '../models/registry';

class RegistryController {
  getByTerritory = asyncErrorHandler(
    async (request: Request, response: Response) => {
      const { territoryId } = request.params;
      const numberTerritory = Number(territoryId);

      const territory = await territoryModel.getByNumber(numberTerritory);
      const { last } = request.query;

      if (last) {
        const lastRegistry = await registryModel.getLastByTerritory(territory);
        return response.json(lastRegistry);
      }

      const territories = await registryModel.getAllByTerritory(territory);
      response.json(territories);
    }
  );

  create = asyncErrorHandler(async (request: Request, response: Response) => {
    const { territoryId } = request.params;
    const numberTerritory = Number(territoryId);
    const { assignedToId } = request.body;
    const conductorId = String(assignedToId);
    delete request.body.assignedTo;

    const currentPeriod = await periodModel.getCurrent();

    request.body.territoryAssigned =
      await territoryModel.getByNumber(numberTerritory);
    request.body.assignedTo = await conductorModel.getById(conductorId);

    const newRegistry = await registryModel.create(currentPeriod, request.body);

    response.status(201).json(newRegistry);
  });

  complete = asyncErrorHandler(async (request: Request, response: Response) => {
    const { territoryId } = request.params;
    const numberTerritory = Number(territoryId);

    const territory = await territoryModel.getByNumber(numberTerritory);
    const lastRegistry = await registryModel.getLastByTerritory(territory);

    const completedRegistry = await registryModel.completeLast(lastRegistry);

    response.status(200).json(completedRegistry);
  });

  update = asyncErrorHandler(async (request: Request, response: Response) => {
    const { territoryId, id } = request.params;
    const numberTerritory = Number(territoryId);
    const { last } = request.query;

    if (last) {
      const territory = await territoryModel.getByNumber(numberTerritory);
      const lastRegistry = await registryModel.getLastByTerritory(territory);

      const updatedLastRegistry = await registryModel.updateLastRegistry(
        lastRegistry,
        request.body
      );

      return response.status(200).json(updatedLastRegistry);
    }

    const updatedRegistry = await registryModel.update(id, request.body);
    response.status(200).json(updatedRegistry);
  });

  delete = async (request: Request, response: Response) => {
    const { id } = request.params;

    await registryModel.delete(id);

    response.status(204).send(null);
  };
}

export const registryController = new RegistryController();
