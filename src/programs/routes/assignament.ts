import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { uuidParamSchema } from '../../shared/schemas/id';
import { getPaginationSchema } from '../../shared/schemas/pagination';
import { assignamentController } from '../controllers/assignament';
import {
  coveredSchema,
  currentCreateSchema,
  updateSchema
} from '../schemas/assignament';

export const assignamentRouter = Router();

assignamentRouter.get(
  '',
  ensureInputIsValid(getPaginationSchema),
  assignamentController.getPagination
);

assignamentRouter.post(
  '',
  ensureInputIsValid(currentCreateSchema),
  assignamentController.create
);

assignamentRouter.post(
  '/:id/covered',
  ensureInputIsValid(coveredSchema),
  assignamentController.covered
);

assignamentRouter.patch(
  '/:id',
  ensureInputIsValid(updateSchema),
  assignamentController.update
);

assignamentRouter.delete(
  '/:id',
  ensureInputIsValid(uuidParamSchema),
  assignamentController.delete
);
