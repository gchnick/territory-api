import { Request, Response } from 'express';
import { asyncErrorHandler } from '../../shared/controllers/async-error-handler';
import { availabilityModel } from '../models/availability';
import { conductorModel } from '../models/conductor';

class AvailabilityController {
  set = asyncErrorHandler(async (request: Request, response: Response) => {
    const { conductorId } = request.params;

    const conductor = await conductorModel.getById(conductorId);

    const updatedConductor = await availabilityModel.set(
      conductor,
      request.body
    );

    response.status(200).json(updatedConductor);
  });

  delete = async (request: Request, response: Response) => {
    const { conductorId } = request.params;

    await availabilityModel.delete(conductorId);
    response.status(204).send(null);
  };
}

export const availabilityController = new AvailabilityController();
