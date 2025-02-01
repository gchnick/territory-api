import { CongregationIdMother } from "@/tests/unit/src/contexts/Overseer/congregation/domain/congregation-id-mother";

import { CreateTerritoryCommand } from "@/contexts/Overseer/territories/application/create/create-territory-command";
import { FindByNumberQuery } from "@/contexts/Overseer/territories/application/find-by-number/find-by-number-query";
import {
    Territory,
    TerritoryPrimitives,
} from "@/contexts/Overseer/territories/domain/territory";

import { TerritoryCurrentAssignedMother } from "./territory-current-assigned-mother";
import { TerritoryIdMother } from "./territory-id-mother";
import { TerritoryLabelMother } from "./territory-label-mother";
import { TerritoryLastDateCompletedMother } from "./territory-last-date-completed-mother";
import { TerritoryLocalityInPartMother } from "./territory-locality-in-part-mother";
import { TerritoryLocalityMother } from "./territory-locality-mother";
import { TerritoryMapMother } from "./territory-map-mother";
import { TerritoryNumberMother } from "./territory-number-mother";
import { TerritoryQuantityHouseMother } from "./territory-quantity-house-mother";
import { TerritorySectorMother } from "./territory-sector-mother";

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
      congregationId: CongregationIdMother.create().value,
      id: TerritoryIdMother.create().value,
      number: TerritoryNumberMother.create().value,
      label: TerritoryLabelMother.create().value,
      sector: TerritorySectorMother.create().value,
      locality: TerritoryLocalityMother.create().value,
      localityInPart: TerritoryLocalityInPartMother.create().value,
      map: TerritoryMapMother.create().value,
      quantityHouses: TerritoryQuantityHouseMother.create().value,
      currentAssigned: TerritoryCurrentAssignedMother.create().value,
      lastDateCompleted: TerritoryLastDateCompletedMother.create().value,
      meetingPlaces: [],
      ...params,
    };

    return Territory.fromPrimitives(primitives);
  },
  fromCommand(command: CreateTerritoryCommand): Territory {
    const {
      id,
      congregationId,
      number,
      label,
      sector,
      locality,
      localityInPart,
      quantityHouses,
      lastDateCompleted,
    } = command;
    return this.create({
      id,
      congregationId,
      number,
      label,
      sector,
      locality,
      localityInPart,
      quantityHouses,
      lastDateCompleted,
    });
  },
  fromQuery(query: FindByNumberQuery): Territory {
    const { number } = query;
    return this.create({ number });
  },
};
