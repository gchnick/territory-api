import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { fieldsToDate } from '../../shared/middlewares/fields-to-date';
import { uuidParamSchema } from '../../shared/schemas/id';
import { registryController } from '../controllers/registry';
import {
  createSchema,
  getSchema,
  territoryIdParamSchema,
  updateSchema
} from '../schemas/registry';

export const registryRouter = Router();

registryRouter.get(
  '/:territoryId/registries',
  ensureInputIsValid(getSchema),
  registryController.getByTerritory
);

registryRouter.post(
  '/:territoryId/registries',
  fieldsToDate(['dateAssigned', 'dateCompleted']),
  ensureInputIsValid(createSchema),
  registryController.create
);

registryRouter.post(
  '/:territoryId/registries/close',
  ensureInputIsValid(territoryIdParamSchema),
  registryController.close
);

registryRouter.patch(
  '/:territoryId/registries/:id',
  fieldsToDate(['dateAssigned', 'dateCompleted']),
  ensureInputIsValid(updateSchema),
  registryController.update
);

registryRouter.delete(
  '/registries/:id',
  ensureInputIsValid(uuidParamSchema),
  registryController.delete
);
