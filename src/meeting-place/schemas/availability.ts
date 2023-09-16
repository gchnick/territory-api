import { z } from 'zod';
import { availabilitySchema } from '../../shared/schemas/availability-schema';
import { uuidSchema } from '../../shared/schemas/id';
import { PhoneSchema } from '../../shared/schemas/phone';

const meetingPlaceIdParam = z.object({
  meetingPlaceId: uuidSchema
});

export const setavailabilitySchema = z.object({
  params: meetingPlaceIdParam,
  body: z.object({
    phone: PhoneSchema,
    fieldService: z.boolean(),
    availability: availabilitySchema
  })
});

export const uuidParamSchema = z.object({
  params: meetingPlaceIdParam
});
