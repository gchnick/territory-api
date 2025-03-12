import { Temporal } from "temporal-polyfill";

import { Uuid } from "./value-object/uuid";

export abstract class DomainEvent {
  static EVENT_NAME: string;
  static fromPrimitives: (params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Temporal.Instant;
    attributes: DomainEventAttributes;
  }) => DomainEvent;

  readonly aggregateId: string;
  readonly eventId: string;
  readonly occurredOn: Temporal.Instant;
  readonly eventName: string;

  constructor(params: {
    eventName: string;
    aggregateId: string;
    eventId?: string;
    occurredOn?: Temporal.Instant;
  }) {
    const { aggregateId, eventName, eventId, occurredOn } = params;
    this.aggregateId = aggregateId;
    this.eventId = eventId ?? Uuid.random().value;
    this.occurredOn = occurredOn ?? Temporal.Now.instant();
    this.eventName = eventName;
  }

  abstract toPrimitives(): DomainEventAttributes;
}

export type DomainEventClass = {
  EVENT_NAME: string;
  fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Temporal.Instant;
    attributes: DomainEventAttributes;
  }): DomainEvent;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DomainEventAttributes = any;
