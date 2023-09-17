import { z } from 'zod';
import { booleanSchema } from '../../shared/schemas/boolean';
import { uuidSchema } from '../../shared/schemas/id';

export const getPaginationSchema = z.object({
  query: z.object({
    cursor: uuidSchema.optional(),
    future: booleanSchema.optional(),
    current: booleanSchema.optional()
  })
});

export const createSchema = z.object({
  body: z.object({
    sinceWeek: z.coerce.date().transform((s) => new Date(s)),
    daysDuration: z.number().int().min(1).max(10).default(7)
  })
});

export const updateSchema = z.object({
  params: z.object({
    id: uuidSchema
  }),
  body: z.object({
    sinceWeek: z.coerce
      .date()
      .transform((s) => new Date(s))
      .optional(),
    untilWeek: z.coerce
      .date()
      .transform((s) => new Date(s))
      .optional()
  })
});
