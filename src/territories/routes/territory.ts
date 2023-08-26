import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { fieldToDate } from '../../shared/middlewares/field-to-date';
import { TerritoryController } from '../controllers/territory';
import {
  createSchema,
  deleteSchema,
  getByNumberSchema,
  updateSchema
} from '../schemas/territory';

export const territoryRouter = Router();

territoryRouter.get('/', TerritoryController.getAll);
territoryRouter.get(
  '/:number',
  ensureInputIsValid(getByNumberSchema),
  TerritoryController.getByNumber
);
territoryRouter.post(
  '/',
  fieldToDate('lastDateCompleted'),
  ensureInputIsValid(createSchema),
  TerritoryController.create
);
territoryRouter.patch(
  '/:number',
  fieldToDate('lastDateCompleted'),
  ensureInputIsValid(updateSchema),
  TerritoryController.update
);
territoryRouter.delete(
  '/:id',
  ensureInputIsValid(deleteSchema),
  TerritoryController.delete
);
