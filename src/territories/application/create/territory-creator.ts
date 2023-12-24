import { EventBus } from '@shared/domain/event-bus';
import Logger from '@shared/domain/logger';
import { Territory } from '@territories/domain/territory';
import { TerritoryId } from '@territories/domain/territory-id';
import { TerritoryIsLocked } from '@territories/domain/territory-is-locked';
import { TerritoryLabel } from '@territories/domain/territory-label';
import { TerritoryLastDateCompleted } from '@territories/domain/territory-last-date-completed';
import { TerritoryLimits } from '@territories/domain/territory-limits';
import { TerritoryNumber } from '@territories/domain/territory-number';
import { TerritoryNumberAlreadyRegistry } from '@territories/domain/territory-number-already-registry';
import { TerritoryRepository } from '@territories/domain/territory-repository';

export class TerritoryCreator {
  constructor(
    private log: Logger,
    private repository: TerritoryRepository,
    private eventBus: EventBus,
  ) {
    this.log.setContext('Territory');
  }

  async run(params: {
    id: TerritoryId;
    number: TerritoryNumber;
    label: TerritoryLabel;
    limits: TerritoryLimits;
    lastDateCompleted: TerritoryLastDateCompleted;
  }): Promise<void> {
    const mapByDefault = undefined;
    const isLockedByDefault = new TerritoryIsLocked(false);
    const meetingPlacesByDefault = [];
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
    this.log.info(`Saving new territory <${territory.label}>`);
    const id = await this.repository.save(territory);
    if (id === null) {
      throw new TerritoryNumberAlreadyRegistry(
        `Territory number <${territory.number.value}> already registry`,
      );
    }
    await this.eventBus.publish(territory.pullDomainEvents());
  }
}
