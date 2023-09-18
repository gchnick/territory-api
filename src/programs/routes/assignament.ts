import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { uuidParamSchema } from '../../shared/schemas/id';
import { getPaginationSchema } from '../../shared/schemas/pagination';
import { assignamentController } from '../controllers/assignament';
import {
  createWithProgramSchema,
  currentCreateSchema,
  updateSchema
} from '../schemas/assignament';

export const assignamentRouter = Router();

assignamentRouter.get(
  '/assignaments',
  ensureInputIsValid(getPaginationSchema),
  assignamentController.getPagination
);

assignamentRouter.post(
  '/assignaments',
  ensureInputIsValid(currentCreateSchema),
  assignamentController.create
);

assignamentRouter.post(
  '/:programId/assignaments',
  ensureInputIsValid(createWithProgramSchema),
  assignamentController.create
);

assignamentRouter.patch(
  '/assignaments/:id',
  ensureInputIsValid(updateSchema),
  assignamentController.update
);

assignamentRouter.delete(
  '/assignaments/:id',
  ensureInputIsValid(uuidParamSchema),
  assignamentController.delete
);
