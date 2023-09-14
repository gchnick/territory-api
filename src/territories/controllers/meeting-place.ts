import { Request, Response } from 'express';
import { asyncErrorHandler } from '../../shared/controllers/async-error-handler';
import { meetingPlaceModel } from '../models/meeting-place';
import { territoryModel } from '../models/territory';

class MeetingPlaceController {
  set = asyncErrorHandler(async (request: Request, response: Response) => {
    const { territoryId } = request.params;
    const territoryNumber = Number(territoryId);
    const { meetingPlaces } = request.body;

    const territory = await territoryModel.getByNumber(territoryNumber);

    const updatedTerritory = await meetingPlaceModel.set(
      territory,
      meetingPlaces
    );
    response.status(200).json(updatedTerritory);
  });

  update = asyncErrorHandler(async (request: Request, response: Response) => {
    const { id } = request.params;

    const updatedMeetingPlace = await meetingPlaceModel.update(
      id,
      request.body
    );
    response.status(200).json(updatedMeetingPlace);
  });

  delete = asyncErrorHandler(async (request: Request, response: Response) => {
    const { id } = request.params;

    await meetingPlaceModel.delete(id);
    response.status(204).send(null);
  });
}

export const meetingPlaceController = new MeetingPlaceController();
