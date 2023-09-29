import { z } from 'zod';
import { uuidSchema } from '../../shared/schemas/id';

const createSchema = z.object({
  meetingPlaceId: uuidSchema,
  conductorId: uuidSchema,
  date: z.coerce.date().transform((s) => new Date(s))
});

export const currentCreateSchema = z.object({
  body: createSchema
});

export const createWithProgramSchema = z.object({
  params: z.object({
    programId: uuidSchema
  }),
  body: createSchema
});

export const updateSchema = z.object({
  params: z.object({
    id: uuidSchema
  }),
  body: createSchema.partial()
});

export const coveredSchema = z.object({
  params: z.object({
    id: uuidSchema
  }),
  body: z.object({
    completionDate: z.coerce.date().transform((s) => new Date(s))
  })
});
