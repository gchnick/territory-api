import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { uuidParamSchema } from '../../shared/schemas/id';
import { registryController } from '../controllers/registry';
import {
  createSchema,
  getSchema,
  territoryIdParamSchema,
  updateSchema,
} from '../schemas/registry';

export const registryRouter = Router();

registryRouter.get(
  '/territories/:territoryId/registries',
  ensureInputIsValid(getSchema),
  registryController.getByTerritory
);

registryRouter.post(
  '/territories/:territoryId/registries',
  ensureInputIsValid(createSchema),
  registryController.create
);

registryRouter.post(
  '/territories/:territoryId/registries/completion',
  ensureInputIsValid(territoryIdParamSchema),
  registryController.completion
);

registryRouter.patch(
  '/registries/:id',
  ensureInputIsValid(updateSchema),
  registryController.update
);

registryRouter.patch(
  '/territories/:territoryId/registries',
  ensureInputIsValid(updateSchema),
  registryController.update
);

registryRouter.delete(
  '/registries/:id',
  ensureInputIsValid(uuidParamSchema),
  registryController.delete
);
