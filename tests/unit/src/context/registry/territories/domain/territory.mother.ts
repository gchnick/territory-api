import { CreateTerritoryCommand } from "@contexts/registry/territories/domain/create-territory-command";
import {
  Territory,
  TerritoryPrimitives,
} from "@contexts/registry/territories/domain/territory";

import { TerritoryIdMother } from "./territory-id-mother";
import { TerritoryIsLockedMother } from "./territory-is-locked-mother";
import { TerritoryLabelMother } from "./territory-label-mother";
import { TerritoryLastDateCompletedMother } from "./territory-last-date-completed-mother";
import { TerritoryLimitsMother } from "./territory-limits.mother";
import { TerritoryMapMother } from "./territory-map-mother";
import { TerritoryNumberMother } from "./territory-number-mother";

export const TerritoryMother = {
  createSuccession(quantity = 50): Territory[] {
    const territory: Territory[] = [];
    for (let number = 1; number <= quantity; number++) {
      territory.push(this.create({ number }));
    }
    return territory;
  },
  create(params?: Partial<TerritoryPrimitives>): Territory {
    const primitives: TerritoryPrimitives = {
      id: TerritoryIdMother.create().value,
      number: TerritoryNumberMother.create().value,
      label: TerritoryLabelMother.create().value,
      limits: TerritoryLimitsMother.create().toPrimitives(),
      map: TerritoryMapMother.create().value,
      isLocked: TerritoryIsLockedMother.create().value,
      lastDateCompleted: TerritoryLastDateCompletedMother.create().value,
      meetingPlaces: [],
      ...params,
    };

    return Territory.fromPrimitives(primitives);
  },
  from(command: CreateTerritoryCommand): Territory {
    const { id, number, label, limits, lastDateCompleted } = command;
    return this.create({ id, number, label, limits, lastDateCompleted });
  },
};
