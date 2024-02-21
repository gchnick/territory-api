import { MeetingPlace } from "@contexts/registry/territories/domain/meeting-place/meeting-place";
import { Territory } from "@contexts/registry/territories/domain/territory";
import { TerritoryId } from "@contexts/registry/territories/domain/territory-id";
import { TerritoryIsLocked } from "@contexts/registry/territories/domain/territory-is-locked";
import { TerritoryLabel } from "@contexts/registry/territories/domain/territory-label";
import { TerritoryLastDateCompleted } from "@contexts/registry/territories/domain/territory-last-date-completed";
import { TerritoryLimits } from "@contexts/registry/territories/domain/territory-limits";
import { TerritoryNumber } from "@contexts/registry/territories/domain/territory-number";
import { TerritoryNumberAlreadyRegistry } from "@contexts/registry/territories/domain/territory-number-already-registry";
import { TerritoryRepository } from "@contexts/registry/territories/domain/territory-repository";
import { EventBus } from "@contexts/shared/domain/event-bus";
import Logger from "@contexts/shared/domain/logger";

export class TerritoryCreator {
  constructor(
    private log: Logger,
    private repository: TerritoryRepository,
    private eventBus: EventBus,
  ) {
    this.log.setContext("Territory");
  }

  async create(params: {
    id: TerritoryId;
    number: TerritoryNumber;
    label: TerritoryLabel;
    limits: TerritoryLimits;
    lastDateCompleted: TerritoryLastDateCompleted;
  }): Promise<void> {
    const mapByDefault = undefined;
    const isLockedByDefault = new TerritoryIsLocked(false);
    const meetingPlacesByDefault: MeetingPlace[] = [];
    const territory = Territory.create(
      params.id,
      params.number,
      params.label,
      params.limits,
      mapByDefault,
      isLockedByDefault,
      params.lastDateCompleted,
      meetingPlacesByDefault,
    );
    this.log.info(`Saving new territory <${territory.label.value}>`);

    try {
      await this.repository.save(territory);
    } catch (error) {
      if (error instanceof TerritoryNumberAlreadyRegistry) {
        throw new TerritoryNumberAlreadyRegistry(
          `Territory number <${territory.number.value}> already registry`,
        );
      }
    }

    await this.eventBus.publish(territory.pullDomainEvents());
  }
}
