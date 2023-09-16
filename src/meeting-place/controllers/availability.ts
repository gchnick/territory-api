import { Request, Response } from 'express';
import { asyncErrorHandler } from '../../shared/controllers/async-error-handler';
import { availabilityModel } from '../models/availability';
import { meetingPlaceModel } from '../models/meeting-place';

class AvailabilityController {
  set = asyncErrorHandler(async (request: Request, response: Response) => {
    const { meetingPlaceId } = request.params;

    const meetingPlace = await meetingPlaceModel.getById(meetingPlaceId);

    const updatedMeetingPlace = await availabilityModel.set(
      meetingPlace,
      request.body
    );

    response.status(200).json(updatedMeetingPlace);
  });

  delete = async (request: Request, response: Response) => {
    const { meetingPlaceId } = request.params;

    await availabilityModel.delete(meetingPlaceId);
    response.status(204).send(null);
  };
}

export const availabilityController = new AvailabilityController();
