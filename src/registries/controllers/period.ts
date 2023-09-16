import { Request, Response } from 'express';
import { asyncErrorHandler } from '../../shared/controllers/async-error-handler';
import { periodModel } from '../models/period';

class PeriodController {
  create = asyncErrorHandler(async (request: Request, response: Response) => {
    const newPeriod = await periodModel.create(request.body);
    response.status(201).json(newPeriod);
  });

  update = asyncErrorHandler(async (request: Request, response: Response) => {
    const { id } = request.params;

    const period = await periodModel.getById(id);

    const updatedPeriod = await periodModel.update(period, request.body);
    response.json(updatedPeriod);
  });

  finishLast = asyncErrorHandler(async (_: Request, response: Response) => {
    const currentPeriod = await periodModel.getCurrent();
    const closedPeriod = await periodModel.finishLast(currentPeriod);
    response.json(closedPeriod);
  });

  delete = async (request: Request, response: Response) => {
    const { id } = request.params;
    await periodModel.delete(id);
    response.status(204).send(null);
  };
}

export const periodController = new PeriodController();
