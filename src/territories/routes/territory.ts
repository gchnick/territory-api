import { Router } from 'express';
import { ensureInputIsValid } from '../../shared/middlewares/ensure-input-is-valid';
import { uuidParamSchema } from '../../shared/schemas/id';
import { territoryController } from '../controllers/territory';
import {
  createSchema,
  getAllSchema,
  getByNumberSchema,
  setMeetingPlacesSchema,
  updateSchema,
} from '../schemas/territory';

export const territoryRouter = Router();

territoryRouter.get(
  '',
  ensureInputIsValid(getAllSchema),
  territoryController.getAll
);

territoryRouter.get(
  '/:number',
  ensureInputIsValid(getByNumberSchema),
  territoryController.getByNumber
);

territoryRouter.post(
  '',
  ensureInputIsValid(createSchema),
  territoryController.create
);

territoryRouter.patch(
  '/:number',
  ensureInputIsValid(updateSchema),
  territoryController.update
);

territoryRouter.put(
  '/:number/meeting-places',
  ensureInputIsValid(setMeetingPlacesSchema),
  territoryController.setMeetingPlaces
);

territoryRouter.delete(
  '/:id',
  ensureInputIsValid(uuidParamSchema),
  territoryController.delete
);
