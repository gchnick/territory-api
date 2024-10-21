import { EntitySchema } from "typeorm";

import { Available } from "@/contexts/Overseer/meeting-place/domain/availability/available";
import { AvailableDay } from "@/contexts/Overseer/meeting-place/domain/availability/available-days";
import { AvailableFrecuency } from "@/contexts/Overseer/meeting-place/domain/availability/available-frecuency";
import { AvailableMoment } from "@/contexts/Overseer/meeting-place/domain/availability/available-moments";
import { EnumValueObjectTransformer } from "@/contexts/shared/infrastructure/persistence/typeorm/enum-value-object-transformer";
import { ValueObjectTransformer } from "@/contexts/shared/infrastructure/persistence/typeorm/value-object-transformer";

/**
 * @deprecated TypeOrm will be remove to Prisma ORM
 */
export const AvailableEntity = new EntitySchema<Available>({
  name: "Available",
  tableName: "available",
  target: Available,
  columns: {
    day: {
      type: "varchar",
      name: "day",
      nullable: false,
      transformer: EnumValueObjectTransformer(AvailableDay),
    },
    frequency: {
      type: "varchar",
      name: "frequency",
      nullable: false,
      transformer: ValueObjectTransformer(AvailableFrecuency),
    },
    moment: {
      type: "varchar",
      name: "moment",
      nullable: false,
      transformer: EnumValueObjectTransformer(AvailableMoment),
    },
  },
});
