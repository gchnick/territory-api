import {
  DomainEvent,
  DomainEventClass,
} from "@/contexts/shared/domain/domain-event";

import { DomainEventSubscribers } from "./domain-event-subscribers";

type DomainEventJSON = {
  type: string;
  aggregateId: string;
  attributes: string;
  id: string;
  occurred_on: string;
};

export class DomainEventDeserializer extends Map<string, DomainEventClass> {
  static configure(subscribers: DomainEventSubscribers) {
    const mapping = new DomainEventDeserializer();
    for (const subscriber of subscribers.items) {
      // eslint-disable-next-line unicorn/no-array-for-each
      subscriber.subscribedTo().forEach(mapping.registerEvent.bind(mapping));
    }

    return mapping;
  }

  private registerEvent(domainEvent: DomainEventClass) {
    const eventName = domainEvent.EVENT_NAME;
    this.set(eventName, domainEvent);
  }

  deserialize(event: string): DomainEvent {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const eventData = JSON.parse(event).data as DomainEventJSON;
    const { type, aggregateId, attributes, id, occurred_on } = eventData;
    const eventClass = super.get(type);

    if (!eventClass) {
      throw new Error(`DomainEvent mapping not found for event ${type}`);
    }

    return eventClass.fromPrimitives({
      aggregateId,
      attributes,
      occurredOn: new Date(occurred_on),
      eventId: id,
    });
  }
}
