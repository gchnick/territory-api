import { CreateTerritoryCommand } from "@/contexts/Overseer/territories/application/create/create-territory-command";

import { TerritoryIdMother } from "../../domain/territory-id-mother";
import { TerritoryLabelMother } from "../../domain/territory-label-mother";
import { TerritoryLastDateCompletedMother } from "../../domain/territory-last-date-completed-mother";
import { TerritoryLocalityInPartMother } from "../../domain/territory-locality-in-part-mother";
import { TerritoryLocalityMother } from "../../domain/territory-locality-mother";
import { TerritoryNumberMother } from "../../domain/territory-number-mother";
import { TerritoryQuantityHouseMother } from "../../domain/territory-quantity-house-mother";
import { TerritorySectorMother } from "../../domain/territory-sector-mother";

type Params = {
  id: string;
  number: number;
  label: string;
  sector?: string;
  locality: string;
  localityInPart?: string;
  quantityHouses: number;
  lastDateCompleted: Date;
};

export const CreateTerritoryCommandMother = {
  create(params?: Partial<Params>): CreateTerritoryCommand {
    const primitives: Params = {
      id: TerritoryIdMother.create().value,
      number: TerritoryNumberMother.create().value,
      label: TerritoryLabelMother.create().value,
      sector: TerritorySectorMother.create().value,
      locality: TerritoryLocalityMother.create().value,
      localityInPart: TerritoryLocalityInPartMother.create().value,
      quantityHouses: TerritoryQuantityHouseMother.create().value,
      lastDateCompleted: TerritoryLastDateCompletedMother.create().value,
      ...params,
    };
    return new CreateTerritoryCommand(primitives);
  },
  invalidLabel(): CreateTerritoryCommand {
    const label = TerritoryLabelMother.invalid().value;
    return this.create({ label });
  },
};
