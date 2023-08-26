import { z } from 'zod';
import { Days, Moments, Privilegies } from '../models/conductor';

const conductorSchema = z.object({
  name: z.string().nonempty().max(100),
  mobilePhone: z.string().nonempty().max(12),
  serviceGroup: z.number().int().min(1).max(20),
  availability: z
    .record(
      z.nativeEnum(Days),
      z.object({
        frequency: z.string().nonempty(),
        moment: z.nativeEnum(Moments)
      })
    )
    .optional(),
  privilegie: z.nativeEnum(Privilegies),
  lastDateAssigned: z.coerce
    .date({
      invalid_type_error: 'Last date assigned be a date'
    })
    .min(new Date('2023-01-01'), { message: 'Last date assigned too old' })
    .max(new Date(), { message: 'Last date completed must be past date' })
    .optional()
});

const conductorId = z.string().uuid();
const conductorIdParam = z.object({
  id: conductorId
});

export const byIdSchema = z.object({
  params: conductorIdParam
});

export const createSchema = z.object({
  body: conductorSchema
});

export const updateSchema = z.object({
  params: conductorIdParam,
  body: conductorSchema.partial()
});
