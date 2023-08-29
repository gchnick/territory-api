import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { fieldsToDate } from '../../shared/middlewares/fields-to-date';
import { RegistryController } from '../controllers/registry';
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
  RegistryController.getByTerritory
);

registryRouter.post(
  '/:territoryId/registries',
  fieldsToDate(['dateAssigned', 'dateCompleted']),
  ensureInputIsValid(createSchema),
  RegistryController.create
);

registryRouter.post(
  '/:territoryId/registries/close',
  ensureInputIsValid(territoryIdParamSchema),
  RegistryController.close
);

registryRouter.patch(
  '/:territoryId/registries/:id',
  fieldsToDate(['dateAssigned', 'dateCompleted']),
  ensureInputIsValid(updateSchema),
  RegistryController.update
);

registryRouter.delete(
  '/registries/:id',
  ensureInputIsValid(deleteSchema),
  RegistryController.delete
);
