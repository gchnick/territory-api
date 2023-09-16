import { z } from 'zod';
import { meetingPlacesSchema } from '../../meeting-place/schemas/meeting-place';
import { CardinalPoint } from '../models/types';

export const numberTerritoryParam = z
  .string()
  .nonempty()
  .min(1)
  .max(2)
  .transform((s) => Number(s));

const territorySchema = z.object({
  number: z
    .number({
      invalid_type_error: 'Territory number must be a number',
      required_error: 'Territory number is required.'
    })
    .int()
    .min(1)
    .max(100),
  label: z
    .string({
      invalid_type_error: 'Territory label must be a string',
      required_error: 'Territory label is required.'
    })
    .nonempty(),
  lastDateCompleted: z.coerce
    .date({
      invalid_type_error: 'Last date completed be a date',
      required_error: 'Last date completed is required.'
    })
    .min(new Date('2023-01-01'), { message: 'Last date completed too old' })
    .max(new Date(), { message: 'Last date completed must be past date' })
    .transform((s) => new Date(s)),
  limits: z.record(z.nativeEnum(CardinalPoint), z.string().nonempty(), {
    required_error: 'Territory limits is required.',
    invalid_type_error:
      'Territory limits must be an record of enum CardinalPoints'
  })
});

export const getByNumberSchema = z.object({
  params: z.object({
    number: numberTerritoryParam
  })
});

export const createSchema = z.object({
  body: territorySchema
});

export const updateSchema = z.object({
  params: z.object({
    number: numberTerritoryParam
  }),
  body: territorySchema.partial()
});

export const setMeetingPlacesSchema = z.object({
  params: z.object({
    number: numberTerritoryParam
  }),
  body: z.object({
    meetingPlaces: meetingPlacesSchema
  })
});
