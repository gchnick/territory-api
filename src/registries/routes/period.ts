import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { fieldsToDate } from '../../shared/middlewares/fields-to-date';
import { uuidParamSchema } from '../../shared/schemas/id';
import { periodController } from '../controllers/period';
import { createSchema, updateSchema } from '../schemas/period';

export const periodRouter = Router();

periodRouter.post(
  '',
  fieldsToDate(['startDate']),
  ensureInputIsValid(createSchema),
  periodController.create
);

periodRouter.patch(
  '/:id',
  fieldsToDate(['finishDate']),
  ensureInputIsValid(updateSchema),
  periodController.update
);

periodRouter.post('/finish-last', periodController.finishLast);

periodRouter.delete(
  '/:id',
  ensureInputIsValid(uuidParamSchema),
  periodController.delete
);
