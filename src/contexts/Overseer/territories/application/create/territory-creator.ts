import { MeetingPlace } from "@/src/contexts/Overseer/meeting-place/domain/meeting-place";
import { Territory } from "@/contexts/Overseer/territories/domain/territory";
import { TerritoryId } from "@/contexts/Overseer/territories/domain/territory-id";
import { TerritoryIsLocked } from "@/contexts/Overseer/territories/domain/territory-is-locked";
import { TerritoryLabel } from "@/contexts/Overseer/territories/domain/territory-label";
import { TerritoryLastDateCompleted } from "@/contexts/Overseer/territories/domain/territory-last-date-completed";
import { TerritoryLocality } from "@/contexts/Overseer/territories/domain/territory-locality";
import { TerritoryLocalityInPart } from "@/contexts/Overseer/territories/domain/territory-locality-in-part";
import { TerritoryMap } from "@/contexts/Overseer/territories/domain/territory-map";
import { TerritoryNumber } from "@/contexts/Overseer/territories/domain/territory-number";
import { TerritoryNumberAlreadyRegistry } from "@/contexts/Overseer/territories/domain/territory-number-already-registry";
import { TerritoryQuantityHouse } from "@/contexts/Overseer/territories/domain/territory-quantity-house";
import { TerritoryRepository } from "@/contexts/Overseer/territories/domain/territory-repository";
import { TerritorySector } from "@/contexts/Overseer/territories/domain/territory-sector";

import { EventBus } from "@/shared/domain/event-bus";
import Logger from "@/shared/domain/logger";
import { Nullable } from "@/shared/domain/nullable";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

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
