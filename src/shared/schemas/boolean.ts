import { z } from 'zod';

export const booleanSchema = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true')
  .optional();
