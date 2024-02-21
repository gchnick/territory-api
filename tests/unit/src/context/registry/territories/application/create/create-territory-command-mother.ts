import { CreateTerritoryCommand } from "@contexts/registry/territories/domain/create-territory-command";
import { TerritoryLimitsPrimitives } from "@contexts/registry/territories/domain/territory-limits";

import { TerritoryIdMother } from "../../domain/territory-id-mother";
import { TerritoryLabelMother } from "../../domain/territory-label-mother";
import { TerritoryLastDateCompletedMother } from "../../domain/territory-last-date-completed-mother";
import { TerritoryLimitsMother } from "../../domain/territory-limits.mother";
import { TerritoryNumberMother } from "../../domain/territory-number-mother";

type Params = {
  id: string;
  number: number;
  label: string;
  limits: TerritoryLimitsPrimitives;
  lastDateCompleted: Date;
};

export const CreateTerritoryCommandMother = {
  create(params?: Partial<Params>): CreateTerritoryCommand {
    const primitives: Params = {
      id: TerritoryIdMother.create().value,
      number: TerritoryNumberMother.create().value,
      label: TerritoryLabelMother.create().value,
      limits: TerritoryLimitsMother.create().toPrimitives(),
      lastDateCompleted: TerritoryLastDateCompletedMother.create().value,
      ...params,
    };
    return new CreateTerritoryCommand(primitives);
  },
  invalidLabel(): CreateTerritoryCommand {
    const primitives: Params = {
      id: TerritoryIdMother.create().value,
      number: TerritoryNumberMother.create().value,
      label: TerritoryLabelMother.invalid().value,
      limits: TerritoryLimitsMother.create().toPrimitives(),
      lastDateCompleted: TerritoryLastDateCompletedMother.create().value,
    };
    return new CreateTerritoryCommand(primitives);
  },
};
