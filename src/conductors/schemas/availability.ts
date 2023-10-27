import { z } from 'zod';
import { availabilitySchema } from '../../shared/schemas/availability-schema';
import { uuidSchema } from '../../shared/schemas/id';

const conductorIdParam = z.object({
  conductorId: uuidSchema,
});

export const setAvailabilitySchema = z.object({
  params: conductorIdParam,
  body: availabilitySchema,
});

export const uuidParamSchema = z.object({
  params: conductorIdParam,
});
