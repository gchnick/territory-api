import { z } from 'zod';
import { booleanSchema } from './boolean';
import { uuidSchema } from './id';

export const getPaginationSchema = z.object({
  query: z.object({
    cursor: uuidSchema.optional(),
    future: booleanSchema.optional(),
    current: booleanSchema.optional()
  })
});
