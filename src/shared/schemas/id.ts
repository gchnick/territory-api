import { z } from 'zod';

export const uuidSchema = z.string().uuid();

export const uuidParamSchema = z.object({
  params: z.object({
    id: uuidSchema
  })
});
