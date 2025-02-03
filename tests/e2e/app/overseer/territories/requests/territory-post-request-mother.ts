import { CongregationIdMother } from "@/tests/unit/src/contexts/Overseer/congregation/domain/congregation-id-mother";
import { TerritoryLabelMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-label-mother";
import { TerritoryLastDateCompletedMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-last-date-completed-mother";
import { TerritoryLocalityInPartMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-locality-in-part-mother";
import { TerritoryLocalityMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-locality-mother";
import { TerritoryNumberMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-number-mother";
import { TerritoryQuantityHouseMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-quantity-house-mother";
import { TerritorySectorMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-sector-mother";

export const TerritoryPostRequestMother = {
  create({
    number = TerritoryNumberMother.create().value,
    congregationId = CongregationIdMother.create().value,
    label = TerritoryLabelMother.create().value,
    sector = TerritorySectorMother.create().value,
    locality = TerritoryLocalityMother.create().value,
    localityInPart = TerritoryLocalityInPartMother.create().value,
    quantityHouses = TerritoryQuantityHouseMother.create().value,
    lastDateCompleted = TerritoryLastDateCompletedMother.create().value.toISOString(),
  } = {}) {
    return {
      number,
      congregationId,
      label,
      sector,
      locality,
      localityInPart,
      quantityHouses,
      lastDateCompleted,
    };
  },
};
