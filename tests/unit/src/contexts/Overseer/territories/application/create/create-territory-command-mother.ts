import { CongregationIdMother } from "@/tests/unit/src/contexts/Overseer/congregation/domain/congregation-id-mother";
import { TerritoryIdMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-id-mother";
import { TerritoryLabelMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-label-mother";
import { TerritoryLastDateCompletedMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-last-date-completed-mother";
import { TerritoryLocalityInPartMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-locality-in-part-mother";
import { TerritoryLocalityMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-locality-mother";
import { TerritoryNumberMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-number-mother";
import { TerritoryQuantityHouseMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-quantity-house-mother";
import { TerritorySectorMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-sector-mother";

import { CreateTerritoryCommand } from "@/contexts/Overseer/territories/application/create/create-territory-command";

interface Params {
  id: string;
  congregationId: number;
  number: number;
  label: string;
  sector?: string;
  locality: string;
  localityInPart?: string;
  quantityHouses: number;
  lastDateCompleted: Date;
}

export const CreateTerritoryCommandMother = {
  create(params?: Partial<Params>): CreateTerritoryCommand {
    const primitives: Params = {
      id: TerritoryIdMother.create().value,
      congregationId: CongregationIdMother.create().value,
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
    const label = TerritoryLabelMother.invalid();
    return this.create({ label });
  },
};
