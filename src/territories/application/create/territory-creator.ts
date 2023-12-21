import { EventBus } from 'src/shared/domain/event-bus';
import { Territory } from 'src/territories/domain/territory';
import { TerritoryId } from 'src/territories/domain/territory-id';
import { TerritoryIsLocked } from 'src/territories/domain/territory-is-locked';
import { TerritoryLabel } from 'src/territories/domain/territory-label';
import { TerritoryLastDateCompleted } from 'src/territories/domain/territory-last-date-completed';
import { TerritoryLimits } from 'src/territories/domain/territory-limits';
import { TerritoryNumber } from 'src/territories/domain/territory-number';
import { TerritoryRepository } from 'src/territories/domain/territory-repository';

export class TerritoryCreator {
  constructor(
    private repository: TerritoryRepository,
    private eventBus: EventBus,
  ) {}

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
    await this.repository.save(territory);
    await this.eventBus.publish(territory.pullDomainEvents());
  }
}
