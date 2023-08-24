import z from 'zod';

const territorySchema = z.object({
  number: z
    .number({
      invalid_type_error: 'Territory number must be a number',
      required_error: 'Territory number is required.'
    })
    .int()
    .min(1)
    .max(100),
  label: z
    .string({
      invalid_type_error: 'Territory label must be a string',
      required_error: 'Territory label is required.'
    })
    .nonempty(),
  lastDateCompleted: z
    .date({
      invalid_type_error: 'Last date completed be a date',
      required_error: 'Last date completed is required.'
    })
    .max(new Date(), { message: 'Last date completed must be past date' }),
  limits: z.record(
    z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST']),
    z.string().nonempty(),
    {
      required_error: 'Territory limits is required.',
      invalid_type_error:
        'Territory limits must be an record of enum CardinalPoints'
    }
  )
});

export function ensureTerritoryIsValid(input: any) {
  return territorySchema.safeParse(input);
}

export function ensurePartialTerritoryIsValid(input: any) {
  return territorySchema.partial().safeParse(input);
}
