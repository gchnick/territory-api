import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { fieldsToDate } from '../../shared/middlewares/fields-to-date';
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
  fieldsToDate(['lastDateCompleted']),
  ensureInputIsValid(createSchema),
  TerritoryController.create
);
territoryRouter.patch(
  '/:number',
  fieldsToDate(['lastDateCompleted']),
  ensureInputIsValid(updateSchema),
  TerritoryController.update
);
territoryRouter.delete(
  '/:id',
  ensureInputIsValid(deleteSchema),
  TerritoryController.delete
);
