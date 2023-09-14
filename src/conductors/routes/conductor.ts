import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { fieldsToDate } from '../../shared/middlewares/fields-to-date';
import { uuidParamSchema } from '../../shared/schemas/id';
import { conductorController } from '../controllers/conductor';
import { createSchema, updateSchema } from '../schemas/conductor';

export const conductorRouter = Router();

conductorRouter.get('/', conductorController.getAll);
conductorRouter.get(
  '/:id',
  ensureInputIsValid(uuidParamSchema),
  conductorController.getById
);
conductorRouter.post(
  '/',
  fieldsToDate(['lastDateAssigned']),
  ensureInputIsValid(createSchema),
  conductorController.create
);
conductorRouter.patch(
  '/:id',
  fieldsToDate(['lastDateAssigned']),
  ensureInputIsValid(updateSchema),
  conductorController.update
);
conductorRouter.delete(
  '/:id',
  ensureInputIsValid(uuidParamSchema),
  conductorController.delete
);
