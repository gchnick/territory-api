import { DomainEvent } from "@/shared/domain/domain-event";

type CreateTerritoryDomainEventAttributes = {
  readonly number: number;
  readonly label: string;
};

export class TerritoryCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = "territory.created";

  readonly number: number;
  readonly label: string;

  constructor({
    aggregateId,
    number,
    label,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    eventId?: string;
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
    this.number = number;
    this.label = label;
  }

  toPrimitives(): CreateTerritoryDomainEventAttributes {
    const { number, label } = this;
    return {
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
      number: attributes.number,
      label: attributes.label,
      eventId,
      occurredOn,
    });
  }
}
