import { Router } from 'express';

import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { availabilityController } from '../controllers/availability';
import {
  setAvailabilitySchema,
  uuidParamSchema
} from '../schemas/availability';

export const availabilityRouter = Router();

availabilityRouter.put(
  '/:conductorId/availability',
  ensureInputIsValid(setAvailabilitySchema),
  availabilityController.set
);

availabilityRouter.delete(
  '/:conductorId/availability',
  ensureInputIsValid(uuidParamSchema),
  availabilityController.delete
);
