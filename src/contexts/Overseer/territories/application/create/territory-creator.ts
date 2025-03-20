import { EventBus } from "@/shared/domain/event-bus";
import Logger from "@/shared/domain/logger";
import { Nullable } from "@/shared/domain/nullable";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { CongregationId } from "@/contexts/Overseer/congregations/domain/congregation-id";
import { MeetingPlace } from "@/contexts/Overseer/territories/domain/meeting-place";
import { Territory } from "@/contexts/Overseer/territories/domain/territory";
import { TerritoryCurrentAssigned } from "@/contexts/Overseer/territories/domain/territory-current-assigned";
import { TerritoryId } from "@/contexts/Overseer/territories/domain/territory-id";
import { TerritoryLabel } from "@/contexts/Overseer/territories/domain/territory-label";
import { TerritoryLastDateCompleted } from "@/contexts/Overseer/territories/domain/territory-last-date-completed";
import { TerritoryLocality } from "@/contexts/Overseer/territories/domain/territory-locality";
import { TerritoryMap } from "@/contexts/Overseer/territories/domain/territory-map";
import { TerritoryNumber } from "@/contexts/Overseer/territories/domain/territory-number";
import { TerritoryNumberAlreadyRegistry } from "@/contexts/Overseer/territories/domain/territory-number-already-registry";
import { TerritoryQuantityHouse } from "@/contexts/Overseer/territories/domain/territory-quantity-house";
import { TerritoryRepository } from "@/contexts/Overseer/territories/domain/territory-repository";
import { TerritorySector } from "@/contexts/Overseer/territories/domain/territory-sector";
import { UniqueContrainError } from "@/contexts/shared/domain/persistence/error/unique-contrain-error";

@Injectable()
export class TerritoryCreator {
  constructor(
    private readonly logger: Logger,
    private readonly repository: TerritoryRepository,
    private readonly eventBus: EventBus,
  ) {}

  async create(params: {
    id: TerritoryId;
    congregationId: CongregationId;
    number: TerritoryNumber;
    label: TerritoryLabel;
    sector: Nullable<TerritorySector>;
    locality: TerritoryLocality;
    localityInPart: Nullable<TerritoryLocality>;
    quantityHouses: TerritoryQuantityHouse;
    lastDateCompleted: TerritoryLastDateCompleted;
  }): Promise<void> {
    const map: Nullable<TerritoryMap> = undefined;
    const currentAssigned = new TerritoryCurrentAssigned(false);
    const meetingPlaces: MeetingPlace[] = [];
    const territory = Territory.create(
      params.congregationId,
      currentAssigned,
      params.id,
      params.label,
      params.lastDateCompleted,
      params.locality,
      params.localityInPart,
      map,
      meetingPlaces,
      params.number,
      params.quantityHouses,
      params.sector,
    );
    this.logger.log(
      `Saving new territory <${territory.label.value}>`,
      "Territory",
    );

    try {
      await this.repository.save(territory);
    } catch (error) {
      if (error instanceof UniqueContrainError) {
        this.logger.warn(`[${error.code}]: ${error.message}`, "Territory");
        throw new TerritoryNumberAlreadyRegistry(
          `Territory Number <${territory.number.value}> already registry to congregation <${territory.congregation.value}>`,
        );
      }
    }

    await this.eventBus.publish(territory.pullDomainEvents());
  }
}
