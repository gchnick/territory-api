import { z } from 'zod';
import { availabilitySchema } from '../../shared/schemas/availability-schema';
import { uuidSchema } from '../../shared/schemas/id';
import { PhoneSchema } from '../../shared/schemas/phone';
import { numberTerritoryParam } from './territory';

const isLatitudeRegex = /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})$/;
const isLongitudeRegex = /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$/;

const meetingPlaceSchema = z.object({
  place: z.string().nonempty().max(200),
  phone: PhoneSchema.optional(),
  latitude: z
    .string()
    .refine((s) => isLatitudeRegex.test(s), {
      message: 'The string must be a latitude coordiante'
    })
    .optional(),
  longitude: z
    .string()
    .refine((s) => isLongitudeRegex.test(s), {
      message: 'The string must be a longitude coordiante'
    })
    .optional(),
  fieldService: z.boolean().default(false),
  availability: availabilitySchema
});

export const meetingPlacesSchema = z.object({
  meetingPlaces: meetingPlaceSchema.array()
});

export const setMeetingPlacesSchema = z.object({
  params: z.object({
    territoryId: numberTerritoryParam
  }),
  body: meetingPlacesSchema
});

export const updateMeetingPlaceSchema = z.object({
  params: z.object({
    id: uuidSchema
  }),
  body: meetingPlaceSchema
});
