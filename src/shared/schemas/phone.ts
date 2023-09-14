import { z } from 'zod';

export const PhoneSchema = z.string().nonempty().max(12);
