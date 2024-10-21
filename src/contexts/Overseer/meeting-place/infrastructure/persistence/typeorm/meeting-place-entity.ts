import { EntitySchema } from "typeorm";

import { MeetingPlace } from "@/contexts/Overseer/meeting-place/domain/meeting-place";
import { MeetingPlaceFieldService } from "@/contexts/Overseer/meeting-place/domain/meeting-place-field-service";
import { MeetingPlaceId } from "@/contexts/Overseer/meeting-place/domain/meeting-place-id";
import { MeetingPlaceLabel } from "@/contexts/Overseer/meeting-place/domain/meeting-place-label";
import { MeetingPlaceLatitude } from "@/contexts/Overseer/meeting-place/domain/meeting-place-latitude";
import { MeetingPlaceLongitude } from "@/contexts/Overseer/meeting-place/domain/meeting-place-longitude";
import { MeetingPlacePhone } from "@/contexts/Overseer/meeting-place/domain/meeting-place-phone";
import { ValueObjectTransformer } from "@/contexts/shared/infrastructure/persistence/typeorm/value-object-transformer";

import { AvailabilityEntity } from "./availability-entity";

/**
 * @deprecated TypeOrm will be remove to Prisma ORM
 */
export const MeetingPlaceEntity = new EntitySchema<MeetingPlace>({
  name: "MeetingPlace",
  tableName: "meeting_places",
  target: MeetingPlace,
  columns: {
    id: {
      type: "varchar",
      primary: true,
      transformer: ValueObjectTransformer(MeetingPlaceId),
    },
    place: {
      type: "varchar",
      length: 200,
      nullable: false,
      transformer: ValueObjectTransformer(MeetingPlaceLabel),
    },
    phone: {
      name: "mobile_phone",
      type: "varchar",
      length: 11,
      nullable: true,
      transformer: ValueObjectTransformer(MeetingPlacePhone),
    },
    latitude: {
      type: "varchar",
      nullable: true,
      transformer: ValueObjectTransformer(MeetingPlaceLatitude),
    },
    longitude: {
      type: "varchar",
      nullable: true,
      transformer: ValueObjectTransformer(MeetingPlaceLongitude),
    },
    fieldService: {
      type: "boolean",
      nullable: false,
      default: false,
      transformer: ValueObjectTransformer(MeetingPlaceFieldService),
    },
  },
  relations: {
    availability: {
      type: "one-to-many",
      target: AvailabilityEntity,
      cascade: true,
      eager: true,
    },
  },
});
