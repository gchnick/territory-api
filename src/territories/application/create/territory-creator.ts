import { EventBus } from '@shared/domain/event-bus';
import Logger from '@shared/domain/logger';
import { Territory } from '@territories/domain/territory';
import { TerritoryId } from '@territories/domain/territory-id';
import { TerritoryIsLocked } from '@territories/domain/territory-is-locked';
import { TerritoryLabel } from '@territories/domain/territory-label';
import { TerritoryLastDateCompleted } from '@territories/domain/territory-last-date-completed';
import { TerritoryLimits } from '@territories/domain/territory-limits';
import { TerritoryNumber } from '@territories/domain/territory-number';
import { TerritoryRepository } from '@territories/domain/territory-repository';

export class TerritoryCreator {
  constructor(
    private logger: Logger,
    private repository: TerritoryRepository,
    private eventBus: EventBus,
  ) {
    this.logger.setContext('Territory');
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
    this.logger.info(`Saving new territory <${territory.label}>`);
    await this.repository.save(territory);
    await this.eventBus.publish(territory.pullDomainEvents());
  }
}