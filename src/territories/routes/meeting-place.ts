import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { meetingPlaceController } from '../controllers/meeting-place';
import {
  deleteMeetingPlaceSchema,
  setMeetingPlacesSchema,
  updateMeetingPlaceSchema
} from '../schemas/meeting-place';

export const meetingPlaceRouter = Router();

meetingPlaceRouter.put(
  '/:territoryId/meeting-places',
  ensureInputIsValid(setMeetingPlacesSchema),
  meetingPlaceController.set
);

meetingPlaceRouter.patch(
  '/meeting-places/:id',
  ensureInputIsValid(updateMeetingPlaceSchema),
  meetingPlaceController.update
);

meetingPlaceRouter.delete(
  '/meeting-places/:id',
  ensureInputIsValid(deleteMeetingPlaceSchema),
  meetingPlaceController.delete
);
