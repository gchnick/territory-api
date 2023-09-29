import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { uuidParamSchema } from '../../shared/schemas/id';
import { getPaginationSchema } from '../../shared/schemas/pagination';
import { programController } from '../controllers/program';
import { createWithProgramSchema } from '../schemas/assignament';
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

programRouter.post(
  '/:id/published',
  ensureInputIsValid(uuidParamSchema),
  programController.published
);

programRouter.post(
  '/:programId/assignaments',
  ensureInputIsValid(createWithProgramSchema),
  programController.addAssignament
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
