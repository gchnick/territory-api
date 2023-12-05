import { z } from 'zod';
import { Days, Moments } from '../models/types';

export const availabilitySchema = z.record(
  z.nativeEnum(Days),
  z.object({
    frequency: z.string().nonempty(),
    moment: z.nativeEnum(Moments),
  })
);
