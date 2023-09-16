import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { availabilityController } from '../controllers/availability';
import {
  setavailabilitySchema,
  uuidParamSchema
} from '../schemas/availability';

export const availabilityRouter = Router();

availabilityRouter.put(
  '/:meetingPlaceId/availability',
  ensureInputIsValid(setavailabilitySchema),
  availabilityController.set
);

availabilityRouter.delete(
  '/:meetingPlaceId/availability',
  ensureInputIsValid(uuidParamSchema),
  availabilityController.delete
);
