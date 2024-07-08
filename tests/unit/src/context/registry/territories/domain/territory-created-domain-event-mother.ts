import { Territory } from "@/contexts/registry/territories/domain/territory";
import { TerritoryCreatedDomainEvent } from "@/contexts/registry/territories/domain/territoy-created-domain-event";

export const TerritoryCreatedDomainEventMother = {
  create({
    aggregateId,
    eventId,
    number,
    label,
    occurredOn,
  }: {
    aggregateId: string;
    eventId?: string;
    number: number;
    label: string;
    occurredOn?: Date;
  }): TerritoryCreatedDomainEvent {
    return new TerritoryCreatedDomainEvent({
      aggregateId,
      eventId,
      number,
      label,
      occurredOn,
    });
  },
  fromTerritory(territory: Territory): TerritoryCreatedDomainEvent {
    return this.create({
      aggregateId: territory.id.value,
      number: territory.number.value,
      label: territory.label.value,
    });
  },
};
