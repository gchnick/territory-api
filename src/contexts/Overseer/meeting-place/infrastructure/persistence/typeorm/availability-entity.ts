import { EntitySchema } from "typeorm";

import { ValueObjectTransformer } from "@/src/contexts/shared/infrastructure/persistence/typeorm/value-object-transformer";

import { AvailabilityId } from "@/contexts/Overseer/meeting-place/domain/availability/availibility-id";
import { MeetingPlaceAvailability } from "@/contexts/Overseer/meeting-place/domain/meeting-place-availability";

import { AvailableEntity } from "./available-entity";

/**
 * @deprecated TypeOrm will be remove to Prisma ORM
 */
export const AvailabilityEntity = new EntitySchema<MeetingPlaceAvailability>({
  name: "MeetingPlaceAvailability",
  tableName: "meeting_place_availability",
  target: MeetingPlaceAvailability,
  columns: {
    id: {
      type: "varchar",
      primary: true,
      transformer: ValueObjectTransformer(AvailabilityId),
    },
  },
  embeddeds: {
    values: {
      schema: AvailableEntity,
      prefix: "available_",
    },
  },
});
