import { Territory } from "@/contexts/Overseer/territories/domain/territory";
import { TerritoryCreatedDomainEvent } from "@/src/contexts/Overseer/territories/domain/territory-created-domain-event";

export const TerritoryCreatedDomainEventMother = {
  create({
    aggregateId,
    eventId,
    congregationId,
    number,
    label,
    occurredOn,
  }: {
    aggregateId: string;
    eventId?: string;
    congregationId: number;
    number: number;
    label: string;
    occurredOn?: Date;
  }): TerritoryCreatedDomainEvent {
    return new TerritoryCreatedDomainEvent({
      aggregateId,
      eventId,
      congregationId,
      number,
      label,
      occurredOn,
    });
  },
  fromTerritory(territory: Territory): TerritoryCreatedDomainEvent {
    return this.create({
      aggregateId: territory.id.value,
      congregationId: territory.congregation.value,
      number: territory.number.value,
      label: territory.label.value,
    });
  },
};
