import { DomainEvent } from "@/shared/domain/domain-event";

type CreateTerritoryDomainEventAttributes = {
  readonly congregationId: number;
  readonly number: number;
  readonly label: string;
};

export class TerritoryCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = "territory.created";

  readonly congregationId: number;
  readonly number: number;
  readonly label: string;

  constructor({
    aggregateId,
    congregationId,
    number,
    label,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    eventId?: string;
    congregationId: number;
    number: number;
    label: string;
    occurredOn?: Date;
  }) {
    super({
      eventName: TerritoryCreatedDomainEvent.EVENT_NAME,
      aggregateId,
      eventId,
      occurredOn,
    });
    this.congregationId = congregationId;
    this.number = number;
    this.label = label;
  }

  toPrimitives(): CreateTerritoryDomainEventAttributes {
    const { congregationId, number, label } = this;
    return {
      congregationId,
      number,
      label,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: CreateTerritoryDomainEventAttributes;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, attributes, occurredOn, eventId } = params;
    return new TerritoryCreatedDomainEvent({
      aggregateId,
      congregationId: attributes.congregationId,
      number: attributes.number,
      label: attributes.label,
      eventId,
      occurredOn,
    });
  }
}
