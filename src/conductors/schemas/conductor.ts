import { z } from 'zod';
import { availabilitySchema } from '../../shared/schemas/availability-schema';
import { uuidSchema } from '../../shared/schemas/id';
import { PhoneSchema } from '../../shared/schemas/phone';

const conductorIdParam = z.object({
  id: uuidSchema
});

const conductorSchema = z.object({
  name: z.string().nonempty().max(100),
  mobilePhone: PhoneSchema,
  serviceGroup: z.number().int().min(1).max(20),
  availability: availabilitySchema
});

export const createSchema = z.object({
  body: conductorSchema
});

export const updateSchema = z.object({
  params: conductorIdParam,
  body: conductorSchema.partial()
});
