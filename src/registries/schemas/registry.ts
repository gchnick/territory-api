import { z } from 'zod';
import { uuidSchema } from '../../shared/schemas/id';
import { numberTerritoryParam } from '../../territories/schemas/territory';

export const territoryIdSchema = z.object({
  territoryId: numberTerritoryParam
});

export const territoryIdParamSchema = z.object({
  params: territoryIdSchema
});

const lastQuery = z
  .object({
    last: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional()
  })
  .optional();

const registrySchema = z.object({
  assignedToId: z.string().uuid(),
  dateAssigned: z.coerce.date().transform((s) => new Date(s)),
  dateCompleted: z.coerce
    .date()
    .transform((s) => new Date(s))
    .optional()
});

export const getSchema = z.object({
  params: territoryIdSchema,
  query: lastQuery
});

export const createSchema = z.object({
  params: territoryIdSchema,
  body: registrySchema
});

export const updateSchema = z.object({
  params: z.object({
    territoryId: numberTerritoryParam,
    id: uuidSchema.optional()
  }),
  body: registrySchema.optional(),
  query: lastQuery
});