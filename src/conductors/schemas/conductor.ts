import { z } from 'zod';
import { uuidSchema } from '../../shared/schemas/id';
import { PhoneSchema } from '../../shared/schemas/phone';
import { Privilegies } from '../models/types';

const conductorIdParam = z.object({
  id: uuidSchema
});

const conductorSchema = z.object({
  name: z.string().nonempty().max(100),
  mobilePhone: PhoneSchema,
  serviceGroup: z.number().int().min(1).max(20),
  privilege: z.nativeEnum(Privilegies),
  lastDateAssigned: z.coerce
    .date()
    .max(new Date())
    .transform((s) => new Date(s))
    .optional()
});

export const createSchema = z.object({
  body: conductorSchema
});

export const updateSchema = z.object({
  params: conductorIdParam,
  body: conductorSchema.partial()
});
