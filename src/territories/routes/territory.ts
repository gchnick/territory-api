import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { fieldsToDate } from '../../shared/middlewares/fields-to-date';
import { uuidParamSchema } from '../../shared/schemas/id';
import { TerritoryController } from '../controllers/territory';
import {
  createSchema,
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
  ensureInputIsValid(uuidParamSchema),
  TerritoryController.delete
);
