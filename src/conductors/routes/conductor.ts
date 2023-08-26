import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { fieldToDate } from '../../shared/middlewares/field-to-date';
import { ConductorController } from '../controllers/conductor';
import { byIdSchema, createSchema, updateSchema } from '../schemas/conductor';

export const conductorRouter = Router();

conductorRouter.get('/', ConductorController.getAll);
conductorRouter.get(
  '/:id',
  ensureInputIsValid(byIdSchema),
  ConductorController.getById
);
conductorRouter.post(
  '/',
  fieldToDate('lastDateAssigned'),
  ensureInputIsValid(createSchema),
  ConductorController.create
);
conductorRouter.patch(
  '/:id',
  fieldToDate('lastDateAssigned'),
  ensureInputIsValid(updateSchema),
  ConductorController.update
);
conductorRouter.delete(
  '/:id',
  ensureInputIsValid(byIdSchema),
  ConductorController.delete
);
