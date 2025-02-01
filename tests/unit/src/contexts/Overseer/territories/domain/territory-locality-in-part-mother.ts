import { TerritoryLocalityInPart } from "@/contexts/Overseer/territories/domain/territory-locality-in-part";

import { TerritoryLocalityMother } from "./territory-locality-mother";

export const TerritoryLocalityInPartMother = {
  create(locality?: string): TerritoryLocalityInPart {
    return new TerritoryLocalityInPart(
      locality ?? TerritoryLocalityMother.locality(),
    );
  },
};
