import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { CongregationId } from "@/contexts/Overseer/congregations/domain/congregation-id";
import { TerritoryCurrentAssigned } from "@/contexts/Overseer/territories/domain/territory-current-assigned";
import { TerritoryId } from "@/contexts/Overseer/territories/domain/territory-id";
import { TerritoryLabel } from "@/contexts/Overseer/territories/domain/territory-label";
import { TerritoryLastDateCompleted } from "@/contexts/Overseer/territories/domain/territory-last-date-completed";
import { TerritoryLocality } from "@/contexts/Overseer/territories/domain/territory-locality";
import { TerritoryLocalityInPart } from "@/contexts/Overseer/territories/domain/territory-locality-in-part";
import { TerritoryMap } from "@/contexts/Overseer/territories/domain/territory-map";
import { TerritoryNumber } from "@/contexts/Overseer/territories/domain/territory-number";
import { TerritoryNumberAlreadyRegistry } from "@/contexts/Overseer/territories/domain/territory-number-already-registry";
import { TerritoryQuantityHouse } from "@/contexts/Overseer/territories/domain/territory-quantity-house";
import {
  PartialTerritoryPrimitives,
  TerritoryRepository,
} from "@/contexts/Overseer/territories/domain/territory-repository";
import { TerritorySector } from "@/contexts/Overseer/territories/domain/territory-sector";

@Injectable()
export class TerritoryUpdater {
  constructor(
    private readonly logger: Logger,
    private readonly repository: TerritoryRepository,
  ) {}

  async update(
    id: TerritoryId,
    congregationId: CongregationId,
    params: {
      currentAssigned?: TerritoryCurrentAssigned;
      label?: TerritoryLabel;
      lastDateCompleted?: TerritoryLastDateCompleted;
      locality?: TerritoryLocality;
      localityInPart?: TerritoryLocalityInPart;
      map?: TerritoryMap;
      number?: TerritoryNumber;
      quantityHouses?: TerritoryQuantityHouse;
      sector?: TerritorySector;
    },
  ): Promise<void> {
    this.logger.log(`Updating territory by id <${id.value}>`, "Territory");

    const {
      currentAssigned,
      label,
      lastDateCompleted,
      locality,
      localityInPart,
      map,
      number,
      quantityHouses,
      sector,
    } = params;

    const primitives: PartialTerritoryPrimitives = {
      currentAssigned: currentAssigned?.value,
      label: label?.value,
      lastDateCompleted: lastDateCompleted?.value,
      locality: locality?.value,
      localityInPart: localityInPart?.value,
      map: map?.value,
      number: number?.value,
      quantityHouses: quantityHouses?.value,
      sector: sector?.value,
    };

    try {
      await this.repository.update(id, congregationId, primitives);
    } catch (error) {
      if (error instanceof TerritoryNumberAlreadyRegistry) {
        throw new TerritoryNumberAlreadyRegistry(
          `Territory Number <${params.number?.value}> already registry`,
        );
      }
    }
  }
}
