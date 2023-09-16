import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { uuidParamSchema } from '../../shared/schemas/id';
import { periodController } from '../controllers/period';
import { createSchema, updateSchema } from '../schemas/period';

export const periodRouter = Router();

periodRouter.post(
  '',
  ensureInputIsValid(createSchema),
  periodController.create
);

periodRouter.patch(
  '/:id',
  ensureInputIsValid(updateSchema),
  periodController.update
);

periodRouter.post('/finish', periodController.finishLast);

periodRouter.delete(
  '/:id',
  ensureInputIsValid(uuidParamSchema),
  periodController.delete
);
