import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { TerritoryCurrentAssigned } from "../../domain/territory-current-assigned";
import { TerritoryId } from "../../domain/territory-id";
import { TerritoryLabel } from "../../domain/territory-label";
import { TerritoryLastDateCompleted } from "../../domain/territory-last-date-completed";
import { TerritoryLocality } from "../../domain/territory-locality";
import { TerritoryLocalityInPart } from "../../domain/territory-locality-in-part";
import { TerritoryMap } from "../../domain/territory-map";
import { TerritoryNumber } from "../../domain/territory-number";
import { TerritoryNumberAlreadyRegistry } from "../../domain/territory-number-already-registry";
import { TerritoryQuantityHouse } from "../../domain/territory-quantity-house";
import {
  PartialTerritoryPrimitives,
  TerritoryRepository,
} from "../../domain/territory-repository";
import { TerritorySector } from "../../domain/territory-sector";

@Injectable()
export class TerritoryUpdater {
  constructor(
    private readonly logger: Logger,
    private readonly repository: TerritoryRepository,
  ) {}

  async update(
    id: TerritoryId,
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
      await this.repository.update(id, primitives);
    } catch (error) {
      if (error instanceof TerritoryNumberAlreadyRegistry) {
        throw new TerritoryNumberAlreadyRegistry(
          `Territory Number <${params.number?.value}> already registry`,
        );
      }
    }
  }
}
