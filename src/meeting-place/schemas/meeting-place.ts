import { z } from 'zod';
import { uuidSchema } from '../../shared/schemas/id';

const isLatitudeRegex = /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})$/;
const isLongitudeRegex = /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$/;

const meetingPlaceSchema = z.object({
  place: z.string().nonempty().max(200),
  latitude: z
    .string()
    .refine(s => isLatitudeRegex.test(s), {
      message: 'The string must be a latitude coordiante',
    })
    .optional(),
  longitude: z
    .string()
    .refine(s => isLongitudeRegex.test(s), {
      message: 'The string must be a longitude coordiante',
    })
    .optional(),
});

export const meetingPlacesSchema = meetingPlaceSchema.array();

export const updateMeetingPlaceSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: meetingPlaceSchema,
});
