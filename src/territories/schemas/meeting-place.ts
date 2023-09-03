import { z } from 'zod';

const isLatitudeRegex = /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})$/;
const isLongitudeRegex = /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$/;

const meetingPlaceSchema = z.object({
  place: z.string().nonempty().max(200),
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
    .optional()
});

export const meetingPlacesSchema = z.object({
  meetingPlaces: meetingPlaceSchema.array()
});

export const setMeetingPlacesSchema = z.object({
  params: z.object({
    territoryId: z.string().nonempty()
  }),
  body: meetingPlacesSchema
});

export const updateMeetingPlaceSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: meetingPlaceSchema
});

export const deleteMeetingPlaceSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
