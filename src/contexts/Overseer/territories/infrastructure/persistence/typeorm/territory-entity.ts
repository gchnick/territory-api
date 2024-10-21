import { EntitySchema } from "typeorm";

import { ValueObjectTransformer } from "@/shared/infrastructure/persistence/typeorm/value-object-transformer";

import { MeetingPlaceEntity } from "@/contexts/Overseer/meeting-place/infrastructure/persistence/typeorm/meeting-place-entity";
import { Territory } from "@/contexts/Overseer/territories/domain/territory";
import { TerritoryId } from "@/contexts/Overseer/territories/domain/territory-id";
import { TerritoryIsLocked } from "@/contexts/Overseer/territories/domain/territory-is-locked";
import { TerritoryLabel } from "@/contexts/Overseer/territories/domain/territory-label";
import { TerritoryLastDateCompleted } from "@/contexts/Overseer/territories/domain/territory-last-date-completed";
import { TerritoryLocality } from "@/contexts/Overseer/territories/domain/territory-locality";
import { TerritoryLocalityInPart } from "@/contexts/Overseer/territories/domain/territory-locality-in-part";
import { TerritoryMap } from "@/contexts/Overseer/territories/domain/territory-map";
import { TerritoryNumber } from "@/contexts/Overseer/territories/domain/territory-number";
import { TerritoryQuantityHouse } from "@/contexts/Overseer/territories/domain/territory-quantity-house";
import { TerritorySector } from "@/contexts/Overseer/territories/domain/territory-sector";

/**
 * @deprecated TypeOrm will be remove to Prisma ORM
 */
export const TerritoryEntity = new EntitySchema<Territory>({
  name: "Territory",
  tableName: "territories",
  target: Territory,
  columns: {
    id: {
      type: "varchar",
      primary: true,
      transformer: ValueObjectTransformer(TerritoryId),
    },
    number: {
      type: "smallint",
      nullable: false,
      unique: true,
      transformer: ValueObjectTransformer(TerritoryNumber),
    },
    label: {
      type: "varchar",
      length: 50,
      nullable: false,
      transformer: ValueObjectTransformer(TerritoryLabel),
    },
    sector: {
      type: "varchar",
      length: 50,
      nullable: true,
      transformer: ValueObjectTransformer(TerritorySector),
    },
    quantityHouses: {
      type: "smallint",
      name: "quantity_houses",
      nullable: true,
      default: 0,
      transformer: ValueObjectTransformer(TerritoryQuantityHouse),
    },
    locality: {
      type: "varchar",
      length: 255,
      nullable: false,
      transformer: ValueObjectTransformer(TerritoryLocality),
    },
    localityInPart: {
      type: "varchar",
      name: "locality_in_part",
      length: 255,
      nullable: true,
      transformer: ValueObjectTransformer(TerritoryLocalityInPart),
    },
    map: {
      type: "varchar",
      name: "url_map_image",
      nullable: true,
      transformer: ValueObjectTransformer(TerritoryMap),
    },
    lastDateCompleted: {
      type: "date",
      name: "last_date_completed",
      nullable: false,
      transformer: ValueObjectTransformer(TerritoryLastDateCompleted),
    },
    isLocked: {
      type: Boolean,
      name: "assigned_lock",
      nullable: false,
      default: false,
      transformer: ValueObjectTransformer(TerritoryIsLocked),
    },
  },
  relations: {
    meetingPlaces: {
      type: "one-to-many",
      target: MeetingPlaceEntity,
      cascade: true,
      eager: true,
    },
  },
});
