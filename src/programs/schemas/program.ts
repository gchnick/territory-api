import { z } from 'zod';
import { firthHours, lastHours } from '../../shared/models/date';
import { uuidSchema } from '../../shared/schemas/id';

export const createSchema = z.object({
  body: z.object({
    sinceWeek: z.coerce.date().transform(s => firthHours(s)),
    daysDuration: z.number().int().min(1).max(10).default(7),
  }),
});

export const updateSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    sinceWeek: z.coerce
      .date()
      .transform(s => new Date(s))
      .optional(),
    untilWeek: z.coerce
      .date()
      .transform(s => lastHours(s))
      .optional(),
  }),
});
