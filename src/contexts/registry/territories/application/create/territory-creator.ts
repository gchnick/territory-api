import { EventBus } from "@/contexts/shared/domain/event-bus";
import Logger from "@/contexts/shared/domain/logger";
import { Nullable } from "@/contexts/shared/domain/nullable";
import { Injectable } from "@/contexts/shared/infrastructure/dependency-injection/injectable";

import { MeetingPlace } from "../../domain/meeting-place/meeting-place";
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
export class TerritoryCreator {
  constructor(
    private readonly logger: Logger,
    private readonly repository: TerritoryRepository,
    private readonly eventBus: EventBus,
  ) {}

  async create(params: {
    id: TerritoryId;
    number: TerritoryNumber;
    label: TerritoryLabel;
    sector: Nullable<TerritorySector>;
    locality: TerritoryLocality;
    localityInPart: Nullable<TerritoryLocalityInPart>;
    quantityHouses: TerritoryQuantityHouse;
    lastDateCompleted: TerritoryLastDateCompleted;
  }): Promise<void> {
    const map: Nullable<TerritoryMap> = undefined;
    const isLocked = new TerritoryIsLocked(false);
    const meetingPlaces: MeetingPlace[] = [];
    const territory = Territory.create(
      params.id,
      params.number,
      params.label,
      params.sector,
      params.locality,
      params.localityInPart,
      params.quantityHouses,
      map,
      isLocked,
      params.lastDateCompleted,
      meetingPlaces,
    );
    this.logger.log(
      `Saving new territory <${territory.label.value}>`,
      "Territory",
    );

    try {
      await this.repository.save(territory);
    } catch (error) {
      if (error instanceof TerritoryNumberAlreadyRegistry) {
        throw new TerritoryNumberAlreadyRegistry(
          `Territory Number <${territory.number.value}> already registry`,
        );
      }
    }

    await this.eventBus.publish(territory.pullDomainEvents());
  }
}
