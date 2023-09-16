import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { uuidParamSchema } from '../../shared/schemas/id';
import { meetingPlaceController } from '../controllers/meeting-place';
import { updateMeetingPlaceSchema } from '../schemas/meeting-place';

export const meetingPlaceRouter = Router();

meetingPlaceRouter.patch(
  '/:id',
  ensureInputIsValid(updateMeetingPlaceSchema),
  meetingPlaceController.update
);

meetingPlaceRouter.delete(
  '/:id',
  ensureInputIsValid(uuidParamSchema),
  meetingPlaceController.delete
);
