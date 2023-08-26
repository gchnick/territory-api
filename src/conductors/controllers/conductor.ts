import { Request, Response } from 'express';
import { RequestBody } from '../../shared/controllers/request-body';
import {
  Conductor,
  ConductorModel,
  PartialConductor
} from '../models/conductor';
import { UUID } from 'crypto';

export class ConductorController {
  static async getAll(_: Request, response: Response) {
    const conductors = await ConductorModel.getAll();
    return response.json(conductors);
  }

  static async getById(request: Request, response: Response) {
    const { id } = request.params;
    const conductor = await ConductorModel.getById(id);
    return response.json(conductor);
  }

  static async create(request: RequestBody<Conductor>, response: Response) {
    const newConductor = await ConductorModel.create(request.body);
    return response.status(201).json(newConductor);
  }

  static async update(
    request: RequestBody<PartialConductor>,
    response: Response
  ) {
    const { id } = request.params;

    const updatedConductor = await ConductorModel.update(id, request.body);
    return response.json(updatedConductor);
  }
  static async delete(request: Request<{ id: UUID}>, response: Response) {
    const { id } = request.params;
    await ConductorModel.delete(id);
    return response.status(204).json(null);
  }
}
