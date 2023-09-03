import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { fieldsToDate } from '../../shared/middlewares/fields-to-date';
import { registryController } from '../controllers/registry';
import {
  createSchema,
  deleteSchema,
  getSchema,
  territoryIdParamSchema,
  updateSchema
} from '../shemas/registry';

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
  ensureInputIsValid(deleteSchema),
  registryController.delete
);
