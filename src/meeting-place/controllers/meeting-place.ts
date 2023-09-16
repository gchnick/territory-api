import { Request, Response } from 'express';
import { asyncErrorHandler } from '../../shared/controllers/async-error-handler';
import { meetingPlaceModel } from '../models/meeting-place';

class MeetingPlaceController {
  update = asyncErrorHandler(async (request: Request, response: Response) => {
    const { id } = request.params;

    const meetingPlace = await meetingPlaceModel.getById(id);

    const updatedMeetingPlace = await meetingPlaceModel.update(
      meetingPlace,
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
