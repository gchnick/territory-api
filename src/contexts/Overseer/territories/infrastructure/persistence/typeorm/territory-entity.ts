import { EntitySchema } from "typeorm";

import { ValueObjectTransformer } from "@/shared/infrastructure/persistence/typeorm/value-object-transformer";

import { Territory } from "../../../domain/territory";
import { TerritoryId } from "../../../domain/territory-id";
import { TerritoryIsLocked } from "../../../domain/territory-is-locked";
import { TerritoryLabel } from "../../../domain/territory-label";
import { TerritoryLastDateCompleted } from "../../../domain/territory-last-date-completed";
import { TerritoryLocality } from "../../../domain/territory-locality";
import { TerritoryLocalityInPart } from "../../../domain/territory-locality-in-part";
import { TerritoryMap } from "../../../domain/territory-map";
import { TerritoryNumber } from "../../../domain/territory-number";
import { TerritoryQuantityHouse } from "../../../domain/territory-quantity-house";
import { TerritorySector } from "../../../domain/territory-sector";

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
});
