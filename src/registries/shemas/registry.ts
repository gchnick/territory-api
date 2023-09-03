import { z } from 'zod';
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
  dateAssigned: z.coerce.date(),
  dateCompleted: z.coerce.date().optional()
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
    id: z.string().uuid().optional()
  }),
  body: registrySchema.optional(),
  query: lastQuery
});

export const deleteSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
