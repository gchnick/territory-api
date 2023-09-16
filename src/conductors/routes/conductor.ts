import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
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
  ensureInputIsValid(createSchema),
  conductorController.create
);

conductorRouter.patch(
  '/:id',
  ensureInputIsValid(updateSchema),
  conductorController.update
);

conductorRouter.delete(
  '/:id',
  ensureInputIsValid(uuidParamSchema),
  conductorController.delete
);
