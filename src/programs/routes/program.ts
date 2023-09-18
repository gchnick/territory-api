import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { uuidParamSchema } from '../../shared/schemas/id';
import { getPaginationSchema } from '../../shared/schemas/pagination';
import { programController } from '../controllers/program';
import { createSchema, updateSchema } from '../schemas/program';

export const programRouter = Router();

programRouter.get(
  '',
  ensureInputIsValid(getPaginationSchema),
  programController.getPagination
);

programRouter.get(
  '/:id',
  ensureInputIsValid(uuidParamSchema),
  programController.get
);

programRouter.post(
  '',
  ensureInputIsValid(createSchema),
  programController.create
);

programRouter.patch(
  '/:id',
  ensureInputIsValid(updateSchema),
  programController.update
);

programRouter.delete(
  '/:id',
  ensureInputIsValid(uuidParamSchema),
  programController.delete
);
