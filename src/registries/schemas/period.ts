import { z } from 'zod';
import { uuidSchema } from '../../shared/schemas/id';

const descriptionPeriod = z.string().nonempty().max(255);

export const createSchema = z.object({
  body: z.object({
    startDate: z.coerce
      .date()
      .transform((s) => new Date(s))
      .optional(),
    description: descriptionPeriod
  })
});

export const updateSchema = z.object({
  params: z.object({
    id: uuidSchema
  }),
  body: z.object({
    description: descriptionPeriod.optional(),
    finishDate: z.coerce
      .date()
      .transform((s) => new Date(s))
      .optional()
  })
});
