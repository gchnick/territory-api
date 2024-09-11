import Logger from "@/shared/domain/logger";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { Territory } from "../../domain/territory";
import { TerritoryId } from "../../domain/territory-id";
import { TerritoryIsLocked } from "../../domain/territory-is-locked";
import { TerritoryLabel } from "../../domain/territory-label";
import { TerritoryLastDateCompleted } from "../../domain/territory-last-date-completed";
import { TerritoryLocality } from "../../domain/territory-locality";
import { TerritoryLocalityInPart } from "../../domain/territory-locality-in-part";
import { TerritoryMap } from "../../domain/territory-map";
import { TerritoryNumber } from "../../domain/territory-number";
import { TerritoryNumberAlreadyRegistry } from "../../domain/territory-number-already-registry";
import { TerritoryQuantityHouse } from "../../domain/territory-quantity-house";
import { TerritoryRepository } from "../../domain/territory-repository";
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
      number?: TerritoryNumber;
      label?: TerritoryLabel;
      sector?: TerritorySector;
      locality?: TerritoryLocality;
      localityInPart?: TerritoryLocalityInPart;
      quantityHouses?: TerritoryQuantityHouse;
      map?: TerritoryMap;
      isLocked?: TerritoryIsLocked;
      lastDateCompleted?: TerritoryLastDateCompleted;
    },
  ): Promise<void> {
    this.logger.log(`Updating territory by id <${id.value}>`, "Territory");

    const {
      number,
      label,
      locality,
      quantityHouses,
      isLocked,
      lastDateCompleted,
    } = params;

    try {
      number &&
      label &&
      locality &&
      quantityHouses &&
      isLocked &&
      lastDateCompleted
        ? await this.repository.update(
            id,
            new Territory(
              id,
              number,
              label,
              params.sector,
              locality,
              params.localityInPart,
              quantityHouses,
              params.map,
              isLocked,
              lastDateCompleted,
              [], // FIXME: TODO: Implement meetingPlace
            ),
          )
        : await this.repository.update(id, params);
    } catch (error) {
      if (error instanceof TerritoryNumberAlreadyRegistry) {
        throw new TerritoryNumberAlreadyRegistry(
          `Territory Number <${params.number?.value}> already registry`,
        );
      }
    }
  }
}
